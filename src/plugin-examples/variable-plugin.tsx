import classNames from "classnames";
import React from "react";
import { Descendant, Editor, Transforms } from "slate";
import { jsx } from "slate-hyperscript";
import { ReactEditor, RenderElementProps, useFocused, useSelected, useSlateStatic } from "slate-react";
import { CustomElement } from "../common/custom-types";
import { kSlateVoidClass } from "../common/slate-types";
import { unwrapElement } from "../common/slate-utils";
import { getDialogController, getPlatformTooltip, registerToolbarButtons } from "../common/toolbar-utils";
import { useSerializing } from "../hooks/use-serializing";
import { IDialogController, IField } from "../modal-dialog/dialog-types";
import { registerElementDeserializer } from "../serialization/html-serializer";
import { classArray, getElementAttrs } from "../serialization/html-utils";
import { registerElementComponent } from "../slate-editor/element";
import IconVariable from "./icon-variable";
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
  const handleDoubleClick = () => {
    editor.configureElement(kVariableFormatCode, getDialogController(editor), element);
  };
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

  registerToolbarButtons(editor, [{
    format: kVariableFormatCode,
    SvgIcon: IconVariable,
    tooltip: getPlatformTooltip("variable"),
    isActive: () => !!editor?.isElementActive(kVariableFormatCode),
    isEnabled: () => !!editor /* ?.isElementEnabled(kVariableFormatCode) */,
    onClick: () => {
      editor?.configureElement(kVariableFormatCode, getDialogController(editor));
    }
  }]);

  const { configureElement, isInline, isVoid } = editor;
  editor.isInline = element => (element.type === kVariableFormatCode) || isInline(element);
  editor.isVoid = element => (element.type === kVariableFormatCode) || isVoid(element);
  editor.plugins.variables = { a: "1", b: "2", c: "3" };
  editor.configureElement = (format: string, controller?: IDialogController, node?: CustomElement) => {
    if (format !== kVariableFormatCode) return configureElement(format, controller, node);

    const hasVariable = editor.isElementActive(kVariableFormatCode);

    if (!node && hasVariable) {
      // in theory, clicking toolbar button (!node) with a variable selected turns it back into text
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

      controller?.display({
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
