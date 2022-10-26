import React, { useCallback, useRef, useState } from "react";
import { IProps as IEditorProps, SlateEditor } from "../slate-editor/slate-editor";
import { Editor } from "slate";
import { SlateToolbar } from "../slate-toolbar/slate-toolbar";
import { IProps as IPortalToolbarProps, SlateToolbarPortal } from "../slate-toolbar/slate-toolbar-portal";
import "./slate-container.scss";
import { toggleMark } from "../slate-editor/slate-utils";
import { EditorValue, EFormat } from "../common/slate-types";

const hotkeyMap = {
        'mod+b': (editor: Editor) => toggleMark(editor, EFormat.bold),
        'mod+i': (editor: Editor) => toggleMark(editor, EFormat.italic),
        'mod+u': (editor: Editor) => toggleMark(editor, EFormat.underlined),
        'mod+\\': (editor: Editor) => toggleMark(editor, EFormat.code)
      };

interface IProps extends IEditorProps {
  className?: string;
  editorClassName?: string;
  value: EditorValue; // Should this just be Decendant[]?
  toolbar?: IPortalToolbarProps;
}

export const SlateContainer: React.FC<IProps> = (props: IProps) => {
  const { className: toolbarClasses, portalRoot, ...toolbarOthers } = props.toolbar || {};
  const { className, editorClassName }  = props ; //, onEditorRef, onValueChange, onContentChange,
          //onBlur, onFocus, ...others } = props;
    const editorRef = useRef<Editor>();
  const [changeCount, setChangeCount] = useState(0);

  // const handleEditorRef = useCallback((editor?: Editor) => {
  //   editorRef.current = editor;
  //   onEditorRef?.(editor);
  //   setChangeCount(count => ++count);
  // }, [onEditorRef]);
  // const handleFocus = useCallback(() => {
  //   onFocus?.(editorRef.current);
  // }, [onFocus]);
  // const handleBlur = useCallback(() => {
  //   onBlur?.(editorRef.current);
  // }, [onBlur]);

  
  const toolbar = portalRoot
                    ? <SlateToolbarPortal
                        portalRoot={portalRoot}
                        className={toolbarClasses}
                        //editor={editorRef.current}
                        //changeCount={changeCount}
                        {...toolbarOthers}
                      />
                    : <SlateToolbar
                        className={toolbarClasses}
                        //editor={editorRef.current}
                        //changeCount={changeCount}
                        {...toolbarOthers}
                      />;
  return (
    <div className={`ccrte-container slate-container ${className || ""}`}>
      <SlateEditor
        className={editorClassName}
        //value={props.value}
        //hotkeyMap={props.hotkeyMap || hotkeyMap}
        //onEditorRef={handleEditorRef}
        // onValueChange={value => {
        //   onValueChange?.(value);
        //   // trigger toolbar rerender on selection change as well
        //   setChangeCount(count => ++count);
        // }}
        // onContentChange={onContentChange}
        // onFocus={handleFocus}
        // onBlur={handleBlur}
        //{...others}
      > 
      {toolbar}
    </SlateEditor>
    </div>
  );
};