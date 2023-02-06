import React, { useMemo } from "react";
import { Editor } from "slate";
import { Slate } from "slate-react";
import { EditorValue } from "../common/slate-types";
import { defaultHotkeyMap } from "../common/slate-utils";
import { createEditor } from "../create-editor";
import { SerializingContext } from "../hooks/use-serializing";
import { IProps as IEditorProps, SlateEditor } from "../slate-editor/slate-editor";
import { SlateToolbar } from "../slate-toolbar/slate-toolbar";
import { IProps as IPortalToolbarProps, SlateToolbarPortal } from "../slate-toolbar/slate-toolbar-portal";
import "./slate-container.scss";

interface IProps extends IEditorProps {
  className?: string;
  editorClassName?: string;
  value: EditorValue;
  toolbar?: IPortalToolbarProps;
  onInitEditor?: (editor: Editor) => Editor;
}

export const SlateContainer: React.FC<IProps> = (props: IProps) => {
  const { className, editorClassName, value, toolbar, onInitEditor, ...others } = props;
  // const editorRef = useRef<Editor>();
  // const [changeCount, setChangeCount] = useState(0);
  // const handleEditorRef = useCallback((editor?: Editor) => {
  //   editorRef.current = editor;
  //   onEditorRef?.(editor);
  //   setChangeCount(count => ++count);
  // }, [onEditorRef]);

  const editor = useMemo(() => createEditor({ history: true, onInitEditor }), [onInitEditor]);
  return (
    <SerializingContext.Provider value={false}>
      <Slate editor={editor} value={value}>
        <div className={`ccrte-container slate-container ${className || ""}`}>
          {renderToolbar(toolbar)}
          <SlateEditor
            className={editorClassName}
            // value={props.value}
            hotkeyMap={props.hotkeyMap || defaultHotkeyMap}
            // onEditorRef={handleEditorRef}
            // onValueChange={value => {
            //   onValueChange?.(value);
            //   // trigger toolbar rerender on selection change as well
            //   setChangeCount(count => ++count);
            // }}
            // onContentChange={onContentChange}
            {...others}
          />
        </div>
      </Slate>
    </SerializingContext.Provider>
  );
};

function renderToolbar(props?: IPortalToolbarProps) {
  return props?.portalRoot
          ? <SlateToolbarPortal {...props} />
          : <SlateToolbar {...props} />;
}
