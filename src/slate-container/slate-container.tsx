import React, { useMemo } from "react";
import { Descendant, Editor } from "slate";
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
  value: EditorValue | (() => EditorValue);
  toolbar?: IPortalToolbarProps;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
  onChange?: (children: Descendant[]) => void;
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
  onInitEditor?: (editor: Editor) => Editor;
}

export const SlateContainer: React.FC<IProps> = (props: IProps) => {
  const { className, editorClassName, value, toolbar, onChange, onInitEditor, ...others } = props;

  const editor = useMemo(() => createEditor({ history: true, onInitEditor }), [onInitEditor]);
  const _value = useMemo(() => Array.isArray(value) ? value : value(), [value]);
  return (
    <SerializingContext.Provider value={false}>
      <Slate editor={editor} initialValue={_value}>
        <div className={`ccrte-container slate-container ${className || ""}`}>
          {renderToolbar(toolbar)}
          <SlateEditor
            className={editorClassName}
            hotkeyMap={props.hotkeyMap || defaultHotkeyMap}
            onChange={onChange}
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
