import React, { useMemo } from "react";
import { IProps as IEditorProps, SlateEditor } from "../slate-editor/slate-editor";
import { Editor } from "slate";
import { SlateToolbar } from "../slate-toolbar/slate-toolbar";
import { IProps as IPortalToolbarProps, SlateToolbarPortal } from "../slate-toolbar/slate-toolbar-portal";
import "./slate-container.scss";
import { toggleMark } from "../slate-editor/slate-utils";
import { EditorValue, EFormat } from "../common/slate-types";
import { Slate } from "slate-react";
import { createEditor } from "../common/create-editor";
import { SerializingContext } from "../hooks/use-serializing";
import { HotkeyMap } from "../common/slate-hooks";

const hotkeyMap = {
        'mod+b': (editor: Editor) => toggleMark(editor, EFormat.bold),
        'mod+i': (editor: Editor) => toggleMark(editor, EFormat.italic),
        'mod+u': (editor: Editor) => toggleMark(editor, EFormat.underlined),
        'mod+\\': (editor: Editor) => toggleMark(editor, EFormat.code)
      };

interface IProps extends IEditorProps {
  className?: string;
  editorClassName?: string;
  value: EditorValue;
  toolbar?: IPortalToolbarProps;
  hotkeyMap?: HotkeyMap
}

export const SlateContainer: React.FC<IProps> = (props: IProps) => {
  const { className: toolbarClasses, portalRoot, ...toolbarOthers } = props.toolbar || {};
  const { className, editorClassName, onBlur, onFocus, ...others }  = props ;
  const editor = useMemo(() => createEditor({ history: true }), []);

  const toolbar = portalRoot
                  ? <SlateToolbarPortal
                      portalRoot={portalRoot}
                      className={toolbarClasses}
                      {...toolbarOthers}
                    />
                  : <SlateToolbar
                      className={toolbarClasses}
                      {...toolbarOthers}
                    />;
  return (
    <SerializingContext.Provider value={false}>
      <div className={`ccrte-container slate-container ${className || ""}`}>
        <Slate editor={editor} value={props.value}>
          {toolbar}
          <SlateEditor
            className={editorClassName}
            hotkeyMap={props.hotkeyMap || hotkeyMap}
            //onEditorRef={handleEditorRef}
            onFocus={onFocus}
            onBlur={onBlur}
            {...others}
          />
        </Slate>
      </div>
    </SerializingContext.Provider>
  );
};