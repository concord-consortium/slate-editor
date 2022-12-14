import React from "react";
import classNames from "classnames/dedupe";
import { Editor, Transforms } from "slate";
import { ReactEditor, RenderElementProps, useFocused, useSelected } from "slate-react";
import { BaseElement, EFormat, VariableElement } from "../common/slate-types";
import { unwrapElement } from "../slate-editor/slate-utils";
import "./variable-plugin.scss";
import { registerElement } from "../slate-editor/element";
import { IDialogController, IField } from "../modal-dialog/dialog-types";
import { useSerializing } from "../hooks/use-serializing";



const kVariableClass = "ccrte-variable";
const kVariableHighlightClass = "ccrte-variable-highlight";
const kSlateVoidClass = "cc-slate-void";
export const kVariableFormat = "variable";

export const isVariableElement = (element: BaseElement): element is VariableElement => {
  return element.type === kVariableFormat;
};
export const VariableComponent = ({ attributes, children, element }: RenderElementProps) => {
  const isFocused = useFocused();
  const isSelected = useSelected();
  const isSerializing = useSerializing();
  const highlightClass = isFocused && isSelected && !isSerializing ? kVariableHighlightClass : undefined;
  const varClasses = classNames(kSlateVoidClass, kVariableClass, highlightClass) || undefined;
  if (!isVariableElement(element)) {
    return null;
  }
  const handleDoubleClick = () => {
    console.log('double click');
  };
  const {name, value} = element;
  return (
    <span {...attributes} onDoubleClick={handleDoubleClick} className={varClasses} contentEditable={false}>
      <span className="ccrte-name">{name}</span>
      {value && <span className="ccrte-equals">=</span>}
      {value && <span className="ccrte-value">{value}</span>}
      {children}
    </span>
   );
};

function getNodeFromDialogValues(values: Record<string, string>) {
  const {name, value} = values;
  const imageElt: VariableElement = { type: EFormat.variable, name: name, value: value , children: [{ text: "" }]};
  return imageElt;
}

function getDialogValuesFromNode(node?: BaseElement) {
  const values: Record<string, string> = {};
  if (node && !isVariableElement(node)) return {};
  node?.name && (values.name = node.name);
  node?.value && (values.value = node.value);
  return values;
}

export function withVariables(editor: Editor) {
  const { configureElement, isInline } = editor;
  editor.isInline = element => (element.type === EFormat.variable) || isInline(element);
  editor.configureElement = (format: string, controller: IDialogController, node?: BaseElement) => {
    if (format !== EFormat.variable) return configureElement(format, controller, node);

    const hasVariable = editor.isElementActive(EFormat.variable);

    if (hasVariable) {
      unwrapElement(editor, EFormat.variable);
    } else {
      const newVariableRow: IField[] = [{ name: "name", type: "input", label: "Name:" }, { name: "value", type: "input", label: "Value:" }];
      const existingVariables: IField[] =  [{
        name: "existing", type: "select", label: "Reference existing variables",
        options: [
          { value: "a", label: "a" },
          { value: "b", label: "b" },
          { value: "c", label: "c" },
        ]
      }];
      const orRow: IField[] =  [{ name: "or", type: "label", label: "or" }];
      const createNewRow: IField[] =  [{ name: "create", type: "label", label: "Create new" }];

      controller.display({
        title: "Insert Variable",
        rows: [...existingVariables, orRow, createNewRow, newVariableRow],
        values: getDialogValuesFromNode(node),
        onValidate: (values) =>  values,
        onAccept: (_editor, values) => {
          const variableElement = getNodeFromDialogValues(values);
          // if editing an existing node, remove the original before inserting the replacement
          const nodePath = node && ReactEditor.findPath(_editor, node);
          nodePath && Transforms.removeNodes(_editor, { at: nodePath });
          Transforms.insertNodes(_editor, variableElement, { select: node != null });
        },
        onClose: (_editor) => ReactEditor.focus(_editor)
      });
    }

  };
  registerElement(EFormat.variable, props => <VariableComponent {...props}/>);
  return editor;
}

