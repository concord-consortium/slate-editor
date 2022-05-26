/*
import React, { ReactNode } from "react";
import classNames from "classnames/dedupe";
import clone from "lodash/clone";
import { Inline } from "slate";
import { Editor, RenderAttributes, RenderInlineProps } from "slate-react";
import { kSlateVoidClass, registerInlineFormat } from "../common/slate-types";
import { hasActiveInline } from "../slate-editor/slate-utils";
import { IFieldValues } from "../slate-toolbar/modal-dialog";
import { IDialogController } from "../slate-toolbar/slate-toolbar";
import { getDataFromElement, getRenderAttributesFromNode, classArray } from "../serialization/html-utils";
import { HtmlSerializablePlugin } from "../plugins/html-serializable-plugin";
import "./variable-plugin.scss";

export const kVariableFormatCode = "variable";
registerInlineFormat(kVariableFormatCode);

function isEmptyValue(value?: number | string) {
  return (value == null) || (value === "");
}

function parseVariableValue(value?: string) {
  return value ? parseFloat(value) : undefined;
}

function formatVariableValue(value?: number) {
  return value != null ? (Math.round(100 * value) / 100).toString() : "";
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
