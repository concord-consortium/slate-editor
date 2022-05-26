/*
import React, { useCallback, useRef, useState } from "react";
import { Value } from "slate";
import IconVariable from "./icon-variable";
import { textToSlate } from "../common/slate-types";
import { kVariableFormatCode, VariablesPlugin } from "./variable-plugin";
import { IProps as ISlateToolbarProps, SlateToolbar, ToolbarTransform } from "../slate-toolbar/slate-toolbar";
import { getPlatformTooltip, IButtonSpec } from "../editor-toolbar/editor-toolbar";
import { IProps as ISlateEditorProps, SlateEditor } from "../slate-editor/slate-editor";
import { Editor } from "slate-react";

export default {
  title: "Plugin Examples"
};

/*
 * Variables
 *
 * Supports creation/editing of variable "chips" with optional values embedded in text.
 *\/
const variablesText = "This example demonstrates a customized toolbar/editor with embedded variables in text.";

const VariablesToolbar = (props: ISlateToolbarProps) => {
  const transform = useCallback<ToolbarTransform>((buttons, editor, dialogController) => {
    return [
      // add the default buttons we care about to the toolbar
      ...["bold", "italic"]
            .map(format => buttons.find(b => b.format === format))
            .filter(b => !!b),
      // add a new button for inserting/editing variable chips
      {
        format: kVariableFormatCode,
        SvgIcon: IconVariable,
        tooltip: getPlatformTooltip("variable"),
        isActive: !!editor && editor.query("isVariableActive"),
        isEnabled: !!editor && editor.query("isVariableEnabled"),
        onClick: () => {
          editor?.command("configureVariable", dialogController);
        }
      }
     ] as IButtonSpec[];
  }, []);
  return (
    <SlateToolbar transform={transform} {...props} />
  );
};

interface IVariablesProps extends Omit<ISlateEditorProps, "value" | "onValueChange"> {}
export const Variables = (props: IVariablesProps) => {
  const [value, setValue] = useState(textToSlate(variablesText));
  const [changeCount, setChangeCount] = useState(0);
  const editorRef = useRef<Editor>();
  const handleEditorRef = useCallback((editor?: Editor) => {
    editorRef.current = editor;
    setChangeCount(count => ++count);
  }, []);
  const variablesPlugin = VariablesPlugin({ a: 1, b: 2, c: 3 });
  const plugins = [variablesPlugin];
  return (
    <div className={`variables-example`}>
      <VariablesToolbar editor={editorRef.current} changeCount={changeCount} />
      <SlateEditor
        plugins={plugins}
        onEditorRef={handleEditorRef}
        value={value}
        onValueChange={(_value: Value) => {
          setValue(_value);
          // trigger toolbar rerender on selection change as well
          setChangeCount(count => ++count);
        }}
        {...props}
      />
    </div>
  );
};
*/
