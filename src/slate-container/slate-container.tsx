import React, { useMemo } from "react";
import { Editor } from "slate";
import { Slate } from "slate-react";
import { IsSerializingContext } from "../common/is-serializing-context";
import { EditorValue, EFormat } from "../common/slate-types";
import { toggleMark } from "../common/slate-utils";
import { createEditor } from "../create-editor";
import { IProps as IEditorProps, SlateEditor } from "../slate-editor/slate-editor";
import { SlateToolbar } from "../slate-toolbar/slate-toolbar";
import { IProps as IPortalToolbarProps, SlateToolbarPortal } from "../slate-toolbar/slate-toolbar-portal";
import "./slate-container.scss";

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
  onEditorRef?: (editor: Editor) => void;
}

export const SlateContainer: React.FC<IProps> = (props: IProps) => {
  const { className, editorClassName, value, toolbar, ...others } = props;
  // const editorRef = useRef<Editor>();
  // const [changeCount, setChangeCount] = useState(0);
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

  const editor = useMemo(() => createEditor({ history: true }), []);
  return (
    <IsSerializingContext.Provider value={false}>
      <Slate editor={editor} value={value}>
        <div className={`ccrte-container slate-container ${className || ""}`}>
          {renderToolbar(toolbar)}
          <SlateEditor
            className={editorClassName}
            // value={props.value}
            hotkeyMap={props.hotkeyMap || hotkeyMap}
            // onEditorRef={handleEditorRef}
            // onValueChange={value => {
            //   onValueChange?.(value);
            //   // trigger toolbar rerender on selection change as well
            //   setChangeCount(count => ++count);
            // }}
            // onContentChange={onContentChange}
            // onFocus={handleFocus}
            // onBlur={handleBlur}
            {...others}
          />
        </div>
      </Slate>
    </IsSerializingContext.Provider>
  );
};

function renderToolbar(props?: IPortalToolbarProps) {
  return props?.portalRoot
          ? <SlateToolbarPortal {...props} />
          : <SlateToolbar {...props} />;
}
