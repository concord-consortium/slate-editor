import React, { ReactNode } from "react";
import classNames from "classnames/dedupe";
import clone from "lodash/clone";
import { Editor, Range, Transforms } from "slate";
import { ReactEditor, RenderElementProps, useFocused, useSelected, useSlateStatic } from "slate-react";
import { CustomElement, EFormat,registerInlineFormat, VariableElement } from "../common/slate-types";
import { hasActiveInline, unwrapElement, wrapElement } from "../slate-editor/slate-utils";
import { IFieldValues } from "../slate-toolbar/modal-dialog";
import { IDialogController } from "../slate-toolbar/slate-toolbar";
import { getDataFromElement, getRenderAttributesFromNode, classArray } from "../serialization/html-utils";
import { HtmlSerializablePlugin } from "../plugins/html-serializable-plugin";
import "./variable-plugin.scss";
import editorToolbarStories from "../editor-toolbar/editor-toolbar.stories";
import { registerElement } from "../slate-editor/element";
import { IField } from "../modal-dialog/dialog-types";
import { useSerializing } from "../hooks/use-serializing";



const kVariableClass = "ccrte-variable";
const kVariableHighlightClass = "ccrte-variable-highlight";
const kSlateVoidClass = "cc-slate-void";


export const isVariableElement = (element: CustomElement): element is VariableElement => {
  return element.type === EFormat.variable;
};
export const VariableComponent = ({ attributes, children, element }: RenderElementProps) => {
  const editor = useSlateStatic();
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
};
function getDialogValuesFromNode(node?: CustomElement) {
  const values: Record<string, string> = {};
  if (node && !isVariableElement(node)) return {};
  node?.name && (values.name = node.name);
  node?.value && (values.value = node.value);
  return values;
};
export function withVariables(editor: Editor) {
  const { configureElement, isElementEnabled, isInline } = editor;
  editor.isInline = element => (element.type === EFormat.variable) || isInline(element);
  editor.configureElement = (format: string, controller: IDialogController, node?: CustomElement) => {
    if (format !== EFormat.variable) return configureElement(format, controller, node);

    const {selection} = editor;
    const hasVariable = editor.isElementActive(EFormat.variable);
    const isCollapsed = selection && Range.isCollapsed(selection);

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

