import React, { useState } from "react";
import { Editor } from "slate-react";
import { EFormat, textToSlate } from "../common/slate-types";
import { SlateEditor } from "../slate-editor/slate-editor";
import { SlateToolbar } from "../slate-toolbar/slate-toolbar";
import "./slate-container.scss";

const initialValue = textToSlate('');
const hotkeyMap = {
        'mod+b': (editor: Editor) => editor.toggleMark(EFormat.bold),
        'mod+i': (editor: Editor) => editor.toggleMark(EFormat.italic),
        'mod+u': (editor: Editor) => editor.toggleMark(EFormat.underlined),
        'mod+\\': (editor: Editor) => editor.toggleMark(EFormat.code),
        'mod+z': (editor: Editor) => editor.undo(),
        'mod+shift+z': (editor: Editor) => editor.redo()
      };

interface IProps {
  containerClassNames?: string;
  toolbarClassNames?: string;
  editorClassNames?: string;
}

export const SlateContainer: React.FC<IProps> = (props: IProps) => {
  const [editor, setEditor] = useState<Editor>();
  const [changeCount, setChangeCount] = useState<number>(0);
  return (
    <div className={`slate-container ${props.containerClassNames || ""}`}>
      <SlateToolbar
        className={`slate-toolbar ${props.toolbarClassNames || ""}`}
        editor={editor}
        changeCount={changeCount} />
      <SlateEditor
        className={`slate-editor ${props.editorClassNames || ""}`}
        initialValue={initialValue}
        hotkeyMap={hotkeyMap}
        onEditorRef={editor => setEditor(editor)}
        onValueChange={() => setChangeCount(count => ++count)}
        // onContentChange={(prevValue: any, newValue: any) => {
        //   debugger;
        // }}
        />
    </div>
  );
};
