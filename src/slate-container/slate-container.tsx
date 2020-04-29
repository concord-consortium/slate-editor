import React, { useCallback, useRef, useState } from "react";
import { Editor } from "slate-react";
import { HotkeyMap } from "../common/slate-hooks";
import { EFormat, EditorValue } from "../common/slate-types";
import { SlateEditor, SlateExchangeValue } from "../slate-editor/slate-editor";
import { SlateToolbar } from "../slate-toolbar/slate-toolbar";
import "./slate-container.scss";

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
  value?: EditorValue | string;
  hotkeyMap?: HotkeyMap;
  onEditorRef?: (editorRef?: Editor) => void;
  onValueChange?: (value: EditorValue) => void;
  onContentChange?: (content: SlateExchangeValue) => void;
  onFocus?: (editor?: Editor) => void;
  onBlur?: (editor?: Editor) => void;
}

export const SlateContainer: React.FC<IProps> = (props: IProps) => {
  const { onEditorRef, onValueChange, onContentChange, onBlur, onFocus } = props;
  const editorRef = useRef<Editor>();
  const [changeCount, setChangeCount] = useState(0);
  const handleEditorRef = useCallback((editor?: Editor) => {
    editorRef.current = editor;
    onEditorRef?.(editor);
  }, [onEditorRef]);
  const handleFocus = useCallback(() => {
    onFocus?.(editorRef.current);
  }, [onFocus]);
  const handleBlur = useCallback(() => {
    onBlur?.(editorRef.current);
  }, [onBlur]);
  return (
    <div className={`slate-container ${props.containerClassNames || ""}`}>
      <SlateToolbar
        className={`slate-toolbar ${props.toolbarClassNames || ""}`}
        editor={editorRef.current}
        changeCount={changeCount}
      />
      <SlateEditor
        className={`slate-editor ${props.editorClassNames || ""}`}
        value={props.value}
        hotkeyMap={props.hotkeyMap || hotkeyMap}
        onEditorRef={handleEditorRef}
        onValueChange={value => {
          onValueChange?.(value);
          // trigger toolbar rerender on selection change as well
          setChangeCount(count => ++count);
        }}
        onContentChange={onContentChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};
