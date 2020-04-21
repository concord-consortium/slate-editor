import React, { useCallback, useRef, useState, useEffect } from "react";
import find from "lodash/find";
import { Value, ValueJSON } from "slate";
import { Editor, OnChangeParam, RenderBlockProps, RenderMarkProps } from "slate-react";
import { renderSlateMark, renderSlateBlock } from "./slate-renderers";
import { HotkeyMap, useHotkeyMap } from "../common/slate-hooks";
import { EditorValue, EFormat, textToSlate } from "../common/slate-types";
import { linkPlugin } from "../plugins/link-plugin";

import './slate-editor.scss';

export interface EditorSelectionJson {
  anchor: number;
  focus: number;
}

export interface IProps {
  className: string;
  initialValue?: EditorValue;
  hotkeyMap?: HotkeyMap;
  onEditorRef?: (editorRef: Editor | undefined) => void;
  onValueChange?: (value: EditorValue) => void;
  onContentChange?: (before: ValueJSON, after: ValueJSON) => void;
  onFocus?: (editor: Editor) => void;
  onBlur?: (editor: Editor) => void;
}

const kEmptyEditorValue = textToSlate("");
const kDefaultHotkeyMap = {
        'mod+b': (editor: Editor) => editor.toggleMark(EFormat.bold),
        'mod+i': (editor: Editor) => editor.toggleMark(EFormat.italic),
        'mod+u': (editor: Editor) => editor.toggleMark(EFormat.underlined),
        'mod+\\': (editor: Editor) => editor.toggleMark(EFormat.code),
        'mod+z': (editor: Editor) => editor.undo(),
        'mod+shift+z': (editor: Editor) => editor.redo()
      };

function exportValue(value: Value) {
  const json = value.toJSON();
  // strip selection and other non-essential properties on export
  return { object: json.object, document: json.document };
}

function renderMark(props: RenderMarkProps, editor: Editor, next: () => any) {
  const renderedMark = renderSlateMark(props);
  return renderedMark || next();
}

function renderBlock(props: RenderBlockProps, editor: Editor, next: () => any) {
  const renderedBlock = renderSlateBlock(props.node.type, props.attributes, props.children);
  return renderedBlock || next();
}

// let renderCount = 0;

const slatePlugins = [linkPlugin];

const SlateEditor: React.FC<IProps> = (props: IProps) => {
  // console.log("SlateEditor.renderCount:", ++renderCount);
  const { onValueChange, onContentChange } = props;
  const editorRef = useRef<Editor>();
  const [editorValue, setEditorValue] = useState<EditorValue>(props.initialValue || kEmptyEditorValue);

  const handleChange = useCallback((change: OnChangeParam) => {
    const isContentChange = change.value.document !== editorValue.document;
    setEditorValue(change.value);
    onValueChange?.(change.value);
    isContentChange && onContentChange?.(exportValue(editorValue), exportValue(change.value));
  }, [editorValue, onValueChange, onContentChange]);

  const hotkeyFnMap = useHotkeyMap(props.hotkeyMap || kDefaultHotkeyMap);
  const handleKeyDown = useCallback((e: React.KeyboardEvent<Element>, editor: Editor, next: () => any) => {
    const found = find(hotkeyFnMap, entry => {
      return entry.isHotkey(e.nativeEvent);
    });
    if (!found) return next();
    e.preventDefault();
    found.invoker(editor);
  }, [hotkeyFnMap]);

  useEffect(() => {
    props.onEditorRef?.(editorRef.current);
  }, [editorRef, props.onEditorRef]);

  return (
    <Editor
      data-testid="slate-editor"
      className={"slate-editor " + props.className}
      ref={editorRef as any}
      value={editorValue}
      plugins={slatePlugins}
      renderMark={renderMark}
      renderBlock={renderBlock}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      // onFocus={() => console.log("SlateEditor.onFocus")}
      // onBlur={() => {
      //   console.log("SlateEditor.onBlur");
      // }}
      />
  );
};
SlateEditor.displayName = "SlateEditor";
export { SlateEditor };
