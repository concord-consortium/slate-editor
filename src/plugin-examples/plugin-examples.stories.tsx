import React, { useCallback, useMemo } from "react";
import IconVariable from "./icon-variable";
import { textToSlate } from "../common/slate-types";
import { kVariableFormatCode, registerVariableElement, withVariables } from "./variable-plugin";
import { IProps as ISlateToolbarProps, SlateToolbar, ToolbarTransform } from "../slate-toolbar/slate-toolbar";
import { getPlatformTooltip, IButtonSpec } from "../editor-toolbar/editor-toolbar";
import { IProps as ISlateEditorProps, SlateEditor } from "../slate-editor/slate-editor";
import { createEditor } from "../create-editor";
import { Slate } from "slate-react";

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
        isActive: !!editor?.isElementActive(kVariableFormatCode),
        isEnabled: !!editor /* ?.isElementEnabled(kVariableFormatCode) */,
        onClick: () => {
          dialogController && editor?.configureElement(kVariableFormatCode, dialogController);
        }
      }
     ] as IButtonSpec[];
  }, []);
  return (
    <SlateToolbar transform={transform} {...props} />
  );
};

export const Variables = (props: ISlateEditorProps) => {
  const initialValue = textToSlate(variablesText);
  const editor = useMemo(() => withVariables(createEditor()), []);
  return (
    <div className={`variables-example`}>
      <Slate editor={editor} value={initialValue}>
        <VariablesToolbar />
        <SlateEditor {...props} />
      </Slate>
    </div>
  );
};
