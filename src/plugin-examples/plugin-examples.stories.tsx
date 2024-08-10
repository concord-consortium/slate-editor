import { Slate } from "slate-react";
import React, { useMemo } from "react";
import { textToSlate } from "../common/slate-types";
import { createEditor } from "../create-editor";
import { IProps as ISlateEditorProps, SlateEditor } from "../slate-editor/slate-editor";
import { IProps as ISlateToolbarProps, SlateToolbar } from "../slate-toolbar/slate-toolbar";
import { registerVariableElement, withVariables } from "./variable-plugin";

export default {
  title: "Plugin Examples"
};

registerVariableElement();

/*
 * Variables
 *
 * Supports creation/editing of variable "chips" with optional values embedded in text.
 */
const variablesText = "This example demonstrates a customized toolbar/editor with embedded variables in text.";

const VariablesToolbar = (props: ISlateToolbarProps) => {
  const { buttons, ...otherProps } = props;
  return (
    <SlateToolbar buttons={["bold", "italic", "variable"]} {...otherProps} />
  );
};

export const Variables = (props: ISlateEditorProps) => {
  const initialValue = textToSlate(variablesText);
  const editor = useMemo(() => withVariables(createEditor()), []);
  return (
    <div className={`variables-example`}>
      <Slate editor={editor} initialValue={initialValue}>
        <VariablesToolbar />
        <SlateEditor {...props} />
      </Slate>
    </div>
  );
};
