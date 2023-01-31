import classNames from "classnames";
import React from "react";
import { Descendant, Editor, Transforms } from "slate";
import { jsx } from "slate-hyperscript";
import { ReactEditor, RenderElementProps, useFocused, useSelected, useSlateStatic } from "slate-react";
import { CustomElement } from "../common/custom-types";
import { kSlateVoidClass } from "../common/slate-types";
import { unwrapElement } from "../common/slate-utils";
import { useSerializing } from "../hooks/use-serializing";
import { IDialogController, IField } from "../modal-dialog/dialog-types";
import { registerElementDeserializer } from "../serialization/html-serializer";
import { classArray, getElementAttrs } from "../serialization/html-utils";
import { registerElementComponent } from "../slate-editor/element";
import "./variable-plugin.scss";

export const kVariableFormatCode = "variable";
const kVariableSpanTag = "span";

export interface VariableElement {
  type: "variable";
  name: string;
  value: string;
  children: Descendant[];
}

export function isVariableElement(e: CustomElement): e is VariableElement {
  return e.type === kVariableFormatCode;
}

function isEmptyValue(value?: number | string) {
  return (value == null) || (value === "");
}

const kVariableClass = "ccrte-variable";
const kVariableHighlightClass = "ccrte-variable-highlight";

function VariableRenderComponent({ element, attributes, children }: RenderElementProps) {
  const editor = useSlateStatic();
  const isFocused = useFocused();
  const isSelected = useSelected();

  if (!isVariableElement(element)) return null;

  const { name = "", value = "" } = element;
  const { className, ...otherAttributes } = attributes as any;
  const highlightClass = isFocused && isSelected ? kVariableHighlightClass : undefined;
  const classes = classNames(classArray(className), kSlateVoidClass, kVariableClass, highlightClass) || undefined;
  const hasValue = !isEmptyValue(value);
  // const onClick = isSerializing ? undefined : _onClick;
  const handleDoubleClick = () => editor.emitEvent("toolbarDialog", element);
  return (
    <span className={classes} {...otherAttributes} onDoubleClick={handleDoubleClick}>
      <span className="ccrte-name">{name}</span>
      {hasValue && <span className="ccrte-equals">=</span>}
      {hasValue && <span className="ccrte-value">{value}</span>}
      {children}
    </span>
  );
}

function VariableSerializeComponent({ element, attributes, children }: RenderElementProps) {
  const { name = "", value = "" } = isVariableElement(element) ? element : {};
  const { className, ...otherAttributes } = attributes as any;
  const hasValue = !isEmptyValue(value);
  const classes = classNames(classArray(className), kSlateVoidClass, kVariableClass) || undefined;
  return (
    <span className={classes} {...otherAttributes}>
      <span className="ccrte-name">{name}</span>
      {hasValue && <span className="ccrte-equals">=</span>}
      {hasValue && <span className="ccrte-value">{value}</span>}
    </span>
  );
}

export const VariableComponent = (props: RenderElementProps) => {
  const isSerializing = useSerializing();
  return isSerializing
          ? <VariableSerializeComponent {...props} />
          : <VariableRenderComponent {...props} />;
};

let isRegistered = false;

export function registerVariableElement() {
  if (isRegistered) return;

  registerElementComponent(kVariableFormatCode, props => <VariableComponent {...props}/>);
  registerElementDeserializer(kVariableSpanTag, {
    test: (el: HTMLElement) => el.nodeName === kVariableSpanTag && el.classList.contains(kVariableFormatCode),
    deserialize: (el: HTMLElement, children: Descendant[]) => {
      const name = el.querySelector(".ccrte-name")?.textContent ?? "";
      const value = el.querySelector(".ccrte-value")?.textContent ?? "";
      return jsx("element", { type: kVariableFormatCode, name, value, ...getElementAttrs(el) }, children);
    }
  });

  isRegistered = true;
}

function getNodeFromDialogValues(editor: Editor, values: Record<string, string>) {
  let { existing, name, value } = values;
  if (existing) {
    name = existing;
    value = editor.plugins.variables[name];
  }
  else if (name) {
    editor.plugins.variables[name] = value;
  }
  return { type: kVariableFormatCode, name, value , children: [{ text: "" }]};
}

function getDialogValuesFromNode(node?: CustomElement) {
  const values: Record<string, string> = {};
  if (node && !isVariableElement(node)) return {};
  node?.name && (values.name = node.name);
  node?.value && (values.value = node.value);
  return values;
}

export function withVariables(editor: Editor) {
  registerVariableElement();

  const { configureElement, isInline, isVoid } = editor;
  editor.isInline = element => (element.type === kVariableFormatCode) || isInline(element);
  editor.isVoid = element => (element.type === kVariableFormatCode) || isVoid(element);
  editor.plugins.variables = { a: "1", b: "2", c: "3" };
  editor.configureElement = (format: string, controller: IDialogController, node?: CustomElement) => {
    if (format !== kVariableFormatCode) return configureElement(format, controller, node);

    const hasVariable = editor.isElementActive(kVariableFormatCode);

    if (hasVariable) {
      unwrapElement(editor, kVariableFormatCode);
    } else {
      const newVariableRow: IField[] = [{ name: "name", type: "input", label: "Name:" }, { name: "value", type: "input", label: "Value:" }];
      const existingVariables: IField[] =  [{
        name: "existing", type: "select", label: "Reference existing variables",
        // example always has the same three variables
        options: Object.keys(editor.plugins.variables).map(key => ({ label: key, value: key }))
      }];
      const orRow: IField[] =  [{ name: "or", type: "label", label: "or" }];
      const createNewRow: IField[] =  [{ name: "create", type: "label", label: "Create new" }];

      controller.display({
        title: "Insert Variable",
        rows: [...existingVariables, orRow, createNewRow, newVariableRow],
        values: getDialogValuesFromNode(node),
        onValidate: (values) =>  values,
        onAccept: (_editor, values) => {
          const variableElement = getNodeFromDialogValues(_editor, values);
          // if editing an existing node, remove the original before inserting the replacement
          const nodePath = node && ReactEditor.findPath(_editor, node);
          nodePath && Transforms.removeNodes(_editor, { at: nodePath });
          Transforms.insertNodes(_editor, variableElement, { select: node != null });
          // Move the cursor to be after the newly inserted variable.
          Transforms.move(_editor, { distance: 1, unit: "word" });
        },
        onClose: (_editor) => ReactEditor.focus(_editor)
      });
    }
  };

  return editor;
}

/*
interface IRenderOptions {
  isSerializing?: boolean;
  isHighlighted?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
}
function renderVariable(node: Inline, attributes: RenderAttributes, children: ReactNode, options?: IRenderOptions) {
  const { data } = node;
  const { className, ...otherAttributes } = attributes;
  const { isHighlighted, isSerializing, onClick: _onClick, onDoubleClick: _onDoubleClick } = options || {};
  const highlightClass = isHighlighted && !isSerializing ? kVariableHighlightClass : undefined;
  const name: string = data.get("name");
  const value: string = data.get("value");
  const hasValue = !isEmptyValue(value);
  const classes = classNames(classArray(className), kSlateVoidClass, kVariableClass, highlightClass) || undefined;
  const onClick = isSerializing ? undefined : _onClick;
  const onDoubleClick = isSerializing ? undefined : _onDoubleClick;
  return (
    <span className={classes} onClick={onClick} onDoubleClick={onDoubleClick} {...otherAttributes}>
      <span className="ccrte-name">{name}</span>
      {hasValue && <span className="ccrte-equals">=</span>}
      {hasValue && <span className="ccrte-value">{value}</span>}
    </span>
  );
}

function getDataFromVariableElement(el: Element) {
  const { data } = getDataFromElement(el);
  const _data: Record<string, string | number | boolean | undefined> = clone(data) || {};
  if (data?.name) {
    _data.name = data.name;
  }
  _data.value = parseVariableValue(data?.value);
  return { data: _data };
}

function getDialogValuesFromNode(editor: Editor, node?: Inline) {
  const values: Record<string, string> = {};
  const { data } = node || {};
  const highlightedText = editor.value.fragment.text;
  let name, value;
  if (highlightedText) {
    values.name = highlightedText;
  }
  else if ((name = data?.get("name"))) {
    values.name = name;
  }
  if ((value = data?.get("value"))) {
    values.value = value;
  }
  return values;
}

const kSpanTag = "span";

export function VariablesPlugin(variables: Record<string, number>): HtmlSerializablePlugin {
  return {
    deserialize: function(el, next) {
      if ((el.tagName.toLowerCase() === kSpanTag) && el.classList.contains(kVariableClass)) {
        const data = getDataFromVariableElement(el);
        return {
          object: "inline",
          type: kVariableFormatCode,
          ...data,
          nodes: next(el.childNodes),
        };
      }
    },
    serialize: function(obj, children) {
      const { object, type } = obj;
      if ((object === "inline") && (type === kVariableFormatCode)) {
        const variable: Inline = obj;
        const omits = ["name", "value"];
        return renderVariable(variable, getRenderAttributesFromNode(variable, omits),
                              children, { isSerializing: true });
      }
    },

    queries: {
      isVariableActive: function(editor: Editor) {
        return hasActiveInline(editor.value, kVariableFormatCode);
      },
      isVariableEnabled: function(editor: Editor) {
        return (editor.value.blocks.size <= 1) && (editor.value.inlines.size === 0);
      }
    },
    commands: {
      configureVariable: function (editor: Editor, dialogController: IDialogController, node?: Inline) {
        dialogController.display({
          title: "Insert Variable",
          rows: [
            {
              name: "reference", type: "select", label: "Reference existing variable:",
              options: Object.keys(variables).map(v => ({ value: v, label: v }))
            },
            { name: "or", type: "label", label: "or" },
            { name: "create", type: "label", label: "Create new variable:" },
            [
              { name: "name", type: "input", label: "Name:" },
              { name: "value", type: "input", label: "Value:" }
            ]
          ],
          values: getDialogValuesFromNode(editor, node),
          onChange: (_editor, name, value, values) => {
            if (name === "name") {
              dialogController.update({ name: value });
            }
            else if (name === "value") {
              if (parseFloat(value) == null) return false;
              dialogController.update({ value });
            }
          },
          onValidate: (values) => {
            return values.reference || values.name ? values : "Error: invalid name";
          },
          onAccept: (_editor, values) => {
            // ... make any necessary changes to the shared model
            return _editor.command("addVariable", values, node);
          }
        });
        return editor;
      },
      addVariable: function (editor: Editor, values: IFieldValues, node?: Inline) {
        let { reference, name, value } = values;
        if (!editor || (!reference && !name && !value)) return editor;
        if (node) {
          editor.moveToStartOfNode(node)
                .deleteForward();
        }
        if (reference) {
          name = reference;
          value = formatVariableValue(variables[name]);
        }
        editor.insertInline({
          type: kVariableFormatCode,
          data: { name, value }
        });
        return editor;
      },
    },
    schema: {
      inlines: {
        [kVariableFormatCode]: {
          isVoid: true
        }
      }
    },

    renderInline: (props: RenderInlineProps, editor: Editor, next: () => any) => {
      const { attributes, node, children } = props;
      if (node.type !== kVariableFormatCode) return next();
      const omits = ["name", "value"];
      const dataAttrs = getRenderAttributesFromNode(node, omits);

      const options: IRenderOptions = {
        isSerializing: false,
        isHighlighted: props.isSelected || props.isFocused,
        onClick: () => editor.moveFocusToStartOfNode(node),
        onDoubleClick: () => editor.command("emit", "toolbarDialog", "configureVariable", node)
      };
      return renderVariable(node, { ...dataAttrs, ...attributes }, children, options);
    }
  };
}
*/
