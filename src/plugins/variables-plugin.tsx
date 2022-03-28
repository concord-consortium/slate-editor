import React, { ReactNode } from "react";
import classNames from "classnames/dedupe";
import clone from "lodash/clone";
import { Inline } from "slate";
import { Editor, RenderAttributes, RenderInlineProps } from "slate-react";
import { EFormat } from "../common/slate-types";
import { hasActiveInline } from "../slate-editor/slate-utils";
import { IFieldValues } from "../slate-toolbar/modal-dialog";
import { IDialogController } from "../slate-toolbar/slate-toolbar";
import { getDataFromElement, getRenderAttributesFromNode, classArray } from "../serialization/html-utils";
import { HtmlSerializablePlugin } from "./html-serializable-plugin";
import "./variables-plugin.scss";

function formatVariable(value: number) {
  return (Math.round(100 * value) / 100).toString();
}

const kVariableClass = "ccrte-variable";
const kVariableHighlightClass = "ccrte-variable-highlight";

interface IRenderOptions {
  isSerializing?: boolean;
  isHighlighted?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
}
function renderVariable(node: Inline, attributes: RenderAttributes, children: ReactNode, options?: IRenderOptions) {
  const { data } = node;
  const { className, ...otherAttributes } = attributes;
  const highlightClass = options?.isHighlighted && !options?.isSerializing ? kVariableHighlightClass : undefined;
  const name: string = data.get("name");
  const value: string = data.get("value");
  const classes = classNames(classArray(className), kVariableClass, highlightClass) || undefined;
  const onClick = options?.isSerializing ? undefined : options?.onClick;
  const onDoubleClick = options?.isSerializing ? undefined : options?.onDoubleClick;
  return (
    <span className={classes} onClick={onClick} onDoubleClick={onDoubleClick} {...otherAttributes}>
      <span className="ccrte-name">{name}</span>
      <span className="ccrte-equals">=</span>
      <span className="ccrte-value">{value}</span>
    </span>
  );
}

function getDataFromVariableElement(el: Element) {
  const { data } = getDataFromElement(el);
  const _data: Record<string, string | number | boolean> = clone(data) || {};
  if (data?.name) {
    _data.name = data.name;
  }
  if (data?.value) {
    _data.value = Math.round(parseFloat(data.value));
  }
  return { data: _data };
}

function getDialogValuesFromNode( editor: Editor, node?: Inline) {
  const values: Record<string, string> = {};
  const { data } = node || {};
  const highlightedText = editor.value.fragment.text;
  let name, value;
  if (highlightedText !== "") {
    values.name = highlightedText;
  } else if ((name = data?.get("name"))) {
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
          type: EFormat.variable,
          ...data,
          nodes: next(el.childNodes),
        };
      }
    },
    serialize: function(obj, children) {
      const { object, type } = obj;
      if ((object === "inline") && (type === EFormat.variable)) {
        const variable: Inline = obj;
        const omits = ["name", "value"];
        return renderVariable(variable, getRenderAttributesFromNode(variable, omits),
                              children, { isSerializing: true });
      }
    },

    queries: {
      isVariableActive: function(editor: Editor) {
        return hasActiveInline(editor.value, EFormat.variable);
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
            const name = values.reference || values.name;
            const value = values.reference ? variables[name] : parseFloat(values.value);
            return !!name && isFinite(value) ? values : "Error: invalid name or value";
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
          value = formatVariable(variables[name]);
        }
        editor.insertInline({
          type: EFormat.variable,
          data: { name, value }
        });
        return editor;
      },
    },
    schema: {
      inlines: {
        variable: {
          isVoid: true
        }
      }
    },

    renderInline: (props: RenderInlineProps, editor: Editor, next: () => any) => {
      const { attributes, node, children } = props;
      if (node.type !== EFormat.variable) return next();
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
