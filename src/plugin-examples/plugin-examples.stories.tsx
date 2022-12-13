import React, { useCallback, useMemo } from "react";
import IconVariable from "./icon-variable";
import { EFormat, textToSlate } from "../common/slate-types";
import { kVariableFormat} from "./variable-plugin";
import { IProps as ISlateToolbarProps, SlateToolbar, ToolbarTransform } from "../slate-toolbar/slate-toolbar";
import { getPlatformTooltip, IButtonSpec } from "../editor-toolbar/editor-toolbar";
import { IProps as ISlateEditorProps } from "../slate-editor/slate-editor";
import { Editable, Slate, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { createEditor } from "../common/create-editor";

export default {
  title: "Plugin Examples"
};

/*
 * Variables: FIXME: put this story back in
 *
 * Supports creation/editing of variable "chips" with optional values embedded in text.
 */
//const variablesText = "This example demonstrates a customized toolbar/editor with embedded variables in text.";

const VariablesToolbar = (props: ISlateToolbarProps) => {
  const transform = useCallback<ToolbarTransform>((buttons, editor, dialogController) => {
    return [
      // add the default buttons we care about to the toolbar
      ...["bold", "italic"]
            .map(format => buttons.find(b => b.format === format))
            .filter(b => !!b),
      // add a new button for inserting/editing variable chips
      {
        format: kVariableFormat,
        SvgIcon: IconVariable,
        tooltip: getPlatformTooltip("variable"),
        isActive: !!editor && editor.isElementActive(EFormat.variable),
        isEnabled: !!editor && editor.isElementEnabled(EFormat.variable),
        onClick: () => {
          console.log('click variable thing');
          if (dialogController) {
            editor?.configureElement(EFormat.variable, dialogController);
          }
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
  //const variablesPlugin = VariablesPlugin({ a: 1, b: 2, c: 3 });
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  return (
    <div className={`variables-example`}>
      <Slate editor={editor} value={textToSlate("hi variable test there")}>
        <Editable>
          <VariablesToolbar/>
          FIXME
        </Editable>
      </Slate>
    
    </div>
  );
};
