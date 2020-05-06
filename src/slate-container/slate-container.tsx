import React, { useCallback, useRef, useState } from "react";
import { Editor } from "slate-react";
import { EFormat } from "../common/slate-types";
import { IProps as IEditorProps, SlateEditor } from "../slate-editor/slate-editor";
import { SlateToolbar } from "../slate-toolbar/slate-toolbar";
import { IProps as IPortalToolbarProps, SlateToolbarPortal } from "../slate-toolbar/slate-toolbar-portal";
import "./slate-container.scss";

const hotkeyMap = {
        'mod+b': (editor: Editor) => editor.toggleMark(EFormat.bold),
        'mod+i': (editor: Editor) => editor.toggleMark(EFormat.italic),
        'mod+u': (editor: Editor) => editor.toggleMark(EFormat.underlined),
        'mod+\\': (editor: Editor) => editor.toggleMark(EFormat.code),
        'mod+z': (editor: Editor) => editor.undo(),
        'mod+shift+z': (editor: Editor) => editor.redo()
      };

const kFontSizeMinimum = .2;
const kFontSizeMaximum = 4;
const kFontSizeDelta = .1;

interface IProps extends IEditorProps {
  className?: string;
  editorClassName?: string;
  toolbar?: IPortalToolbarProps;
}

export const SlateContainer: React.FC<IProps> = (props: IProps) => {
  const { className: toolbarClasses, portalRoot, ...toolbarOthers } = props.toolbar || {};
  const { className, editorClassName, onEditorRef, onValueChange, onContentChange,
          onBlur, onFocus, ...others } = props;
  const editorRef = useRef<Editor>();
  const [changeCount, setChangeCount] = useState(0);
  const [fontSize, setFontSize] = useState(1);
  const style = {fontSize: `${fontSize}em`};
  const handleIncreaseFontSize = () => {
    setFontSize(Math.min(kFontSizeMaximum, fontSize + kFontSizeDelta));
  };
  const handleDecreaseFontSize = () => {
    setFontSize(Math.max(kFontSizeMinimum, fontSize - kFontSizeDelta));
  };
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

  const toolbar = portalRoot
                    ? <SlateToolbarPortal
                        portalRoot={portalRoot}
                        className={toolbarClasses}
                        editor={editorRef.current}
                        changeCount={changeCount}
                        onDecreaseFontSize={handleDecreaseFontSize}
                        onIncreaseFontSize={handleIncreaseFontSize}
                        {...toolbarOthers}
                      />
                    : <SlateToolbar
                        className={toolbarClasses}
                        editor={editorRef.current}
                        changeCount={changeCount}
                        onDecreaseFontSize={handleDecreaseFontSize}
                        onIncreaseFontSize={handleIncreaseFontSize}
                        {...toolbarOthers}
                      />;
  return (
    <div className={`slate-container ${className || ""}`}>
      {toolbar}
      <SlateEditor
        className={editorClassName}
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
        style={style}
        {...others}
      />
    </div>
  );
};
