import React, { useCallback, useRef, useState, useMemo } from "react";
import find from "lodash/find";
import { Value } from "slate";
import { Editor, OnChangeParam, Plugins, RenderBlockProps, RenderMarkProps } from "slate-react";
import { serializeDocument, SlateDocument } from "./serialization";
import { renderSlateMark, renderSlateBlock } from "./slate-renderers";
import { HotkeyMap, useHotkeyMap } from "../common/slate-hooks";
import { EditorValue, EFormat, textToSlate } from "../common/slate-types";
import { linkPlugin } from "../plugins/link-plugin";
import { fontSizePlugin } from "../plugins/font-size-plugin";

import './slate-editor.scss';

export interface EditorSelectionJson {
  anchor: number;
  focus: number;
}

export interface IProps {
  className?: string;
  value?: EditorValue | string;
  hotkeyMap?: HotkeyMap;
  plugins?: Plugins<Editor>;
  onEditorRef?: (editorRef?: Editor) => void;
  onValueChange?: (value: EditorValue) => void;
  onContentChange?: (content: SlateExchangeValue) => void;
  onFocus?: (editor?: Editor) => void;
  onBlur?: (editor?: Editor) => void;
  style?: React.CSSProperties;
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

export interface SlateExchangeValue {
  object: "value";
  data?: { [key: string]: any };
  document?: SlateDocument;
}

function exportValue(value: Value): SlateExchangeValue {
  // strip selection and other non-essential properties on export
  const { document } = value.toJSON();
  return { object: "value", document: document && serializeDocument(document) };
}

function renderMark(props: RenderMarkProps, editor: Editor, next: () => any) {
  const renderedMark = renderSlateMark(props);
  return renderedMark || next();
}

function renderBlock(props: RenderBlockProps, editor: Editor, next: () => any) {
  const renderedBlock = renderSlateBlock(props.node.type, props.attributes, props.children);
  return renderedBlock || next();
}

const slatePlugins = [linkPlugin, fontSizePlugin];

const SlateEditor: React.FC<IProps> = (props: IProps) => {
  const { onEditorRef, onValueChange, onContentChange, onFocus, onBlur, plugins } = props;
  const allPlugins = useMemo(() => [...slatePlugins, ...(plugins || [])], [plugins]);
  const editorRef = useRef<Editor>();
  const value = typeof props.value === "string"
                  ? textToSlate(props.value)
                  : props.value || kEmptyEditorValue;
  const [prevValue, setPrevValue] = useState<EditorValue>(value);

  const fontSize = value.data.get("fontSize");
  const style = fontSize ? {fontSize: `${fontSize}em`} : undefined;

  const handleChange = useCallback((change: OnChangeParam) => {
    const isContentChange = change.value.document !== prevValue.document;
    setPrevValue(change.value);
    onValueChange?.(change.value);
    isContentChange && onContentChange?.(exportValue(change.value));
  }, [prevValue.document, onValueChange, onContentChange]);

  const hotkeyFnMap = useHotkeyMap(props.hotkeyMap || kDefaultHotkeyMap);
  const handleKeyDown = useCallback((e: React.KeyboardEvent<Element>, editor: Editor, next: () => any) => {
    const found = find(hotkeyFnMap, entry => {
      return entry.isHotkey(e.nativeEvent);
    });
    if (!found) return next();
    e.preventDefault();
    found.invoker(editor);
  }, [hotkeyFnMap]);

  const handleEditorRef = useCallback((editor: Editor | null) => {
    editorRef.current = editor || undefined;
    onEditorRef?.(editorRef.current);
  }, [onEditorRef]);

  // For focus/blur, by default Slate will synchronize its internal model with
  // the browser's focus/blur "eventually" in an asynchronous fashion. When
  // there are multiple editors on the screen, focusing/blurring one can cause
  // others to blur/focus in response, which can then result in stale responses.
  // Immediately calling focus/blur in the appropriate callback forces Slate
  // to synchronize the model immediately.
  // cf. https://github.com/ianstormtaylor/slate/issues/2097#issuecomment-464935337
  const handleFocus = useCallback((event, editor) => {
    editor.focus();
    onFocus?.(editor);
  }, [onFocus]);
  const handleBlur = useCallback((event, editor) => {
    editor.blur();
    onBlur?.(editor);
  }, [onBlur]);
  
  return (
    <Editor
      data-testid="slate-editor"
      style={style}
      className={`slate-editor ${props.className || ""}`}
      ref={handleEditorRef}
      value={value}
      plugins={allPlugins}
      renderMark={renderMark}
      renderBlock={renderBlock}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
};
SlateEditor.displayName = "SlateEditor";
export { SlateEditor };
