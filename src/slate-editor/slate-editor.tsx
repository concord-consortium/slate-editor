import React, { useCallback, useRef, useState, useMemo } from "react";
import { Editor, OnChangeParam, Plugins } from "slate-react";
import { Plugin, Value } from "slate";
import find from "lodash/find";
import isEqual from "lodash/isEqual";
import size from "lodash/size";
import { SlateDocument, serializeValue } from "../serialization/serialization";
import { HotkeyMap, useHotkeyMap } from "../common/slate-hooks";
import { EditorValue, EFormat, textToSlate } from "../common/slate-types";
import { ColorPlugin } from "../plugins/color-plugin";
import { CoreBlocksPlugin } from "../plugins/core-blocks-plugin";
import { CoreInlinesPlugin } from "../plugins/core-inlines-plugin";
import { CoreMarksPlugin } from "../plugins/core-marks-plugin";
import { EditorHistory, IOptions as IEditorHistoryOptions, NoEditorHistory } from "../plugins/editor-history";
import { FontSizePlugin, getFontSize } from "../plugins/font-size-plugin";
import { ImagePlugin } from "../plugins/image-plugin";
import { LinkPlugin } from "../plugins/link-plugin";
import { ListPlugin } from "../plugins/list-plugin";
import { TablePlugin } from "../plugins/table-plugin";

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
  history?: boolean | IEditorHistoryOptions;
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
        'mod+\\': (editor: Editor) => editor.toggleMark(EFormat.code)
      };

export interface SlateExchangeValue {
  object: "value";
  data?: { [key: string]: any };
  document?: SlateDocument;
}

function extractUserDataJSON(value: Value) {
  const { data: _data } = value.toJSON({ preserveData: true });
  const { undos, redos, ...others } = _data || {};
  return size(_data) ? { data: {...others} } : undefined;
}
function isValueDataChange(value1: Value, value2: Value) {
  return !isEqual(extractUserDataJSON(value1), extractUserDataJSON(value2));
}

const defaultPlugins: Plugin<Editor>[] = [
        CoreMarksPlugin(), ColorPlugin(),                   // marks
        ImagePlugin(), LinkPlugin(), CoreInlinesPlugin(),   // inlines
        ListPlugin(), TablePlugin(), CoreBlocksPlugin(),    // blocks
        FontSizePlugin()
      ];

const SlateEditor: React.FC<IProps> = (props: IProps) => {
  const { history, onEditorRef, onValueChange, onContentChange, onFocus, onBlur, plugins } = props;
  const historyPlugin = useMemo(() => history || (history == null)  // enabled by default
                                        ? EditorHistory(typeof history === "object" ? history : undefined)
                                        : NoEditorHistory(), [history]);
  const allPlugins = useMemo(() => [...(plugins || []), ...defaultPlugins, historyPlugin], [historyPlugin, plugins]);
  const editorRef = useRef<Editor>();
  const value = typeof props.value === "string"
                  ? textToSlate(props.value)
                  : props.value || kEmptyEditorValue;
  const [prevValue, setPrevValue] = useState<EditorValue>(value);

  const fontSize = getFontSize(value);
  const style = fontSize ? {fontSize: `${fontSize}em`} : undefined;

  const handleChange = useCallback((change: OnChangeParam) => {
    const isContentChange = (change.value.document !== prevValue.document) ||
                              isValueDataChange(change.value, prevValue);
    setPrevValue(change.value);
    onValueChange?.(change.value);
    isContentChange && onContentChange?.(serializeValue(change.value));
  }, [prevValue, onValueChange, onContentChange]);

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
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
};
SlateEditor.displayName = "SlateEditor";
export { SlateEditor };
