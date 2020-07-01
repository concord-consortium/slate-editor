import React, { useCallback, useMemo, useRef } from "react";
import { Editor, OnChangeParam, Plugins } from "slate-react";
import { Node, Plugin, Value } from "slate";
import find from "lodash/find";
import isEqual from "lodash/isEqual";
import size from "lodash/size";
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
import { OnLoadPlugin } from "../plugins/on-load-plugin";
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
  onLoad?: (node: Node) => void;
  onValueChange?: (value: EditorValue) => void;
  onContentChange?: (value: EditorValue) => void;
  onFocus?: (editor?: Editor) => void;
  onBlur?: (editor?: Editor) => void;
  style?: React.CSSProperties;
}

const kEmptyEditorValue = textToSlate("");
const kDefaultHotkeyMap = {
        'mod+b': (editor: Editor) => editor.toggleMark(EFormat.bold),
        'mod+i': (editor: Editor) => editor.toggleMark(EFormat.italic),
        'mod+u': (editor: Editor) => editor.toggleMark(EFormat.underlined)
      };

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
  const { history, onEditorRef, onLoad, onValueChange, onContentChange, onFocus, onBlur, plugins } = props;
  const onLoadPlugin = useMemo(() => OnLoadPlugin(onLoad), [onLoad]);
  const historyPlugin = useMemo(() => history || (history == null)  // enabled by default
                                        ? EditorHistory(typeof history === "object" ? history : undefined)
                                        : NoEditorHistory(), [history]);
  const allPlugins = useMemo(() => [...(plugins || []), ...defaultPlugins, onLoadPlugin, historyPlugin],
                            [onLoadPlugin, historyPlugin, plugins]);
  const editorRef = useRef<Editor>();
  const value = typeof props.value === "string"
                  ? textToSlate(props.value)
                  : props.value || kEmptyEditorValue;

  const fontSize = getFontSize(value);
  const fontStyle = fontSize ? {fontSize: `${fontSize}em`} : undefined;
  const style = { ...props.style, ...fontStyle };

  const handleChange = (change: OnChangeParam) => {
    const isContentChange = (change.value.document !== value.document) ||
                              isValueDataChange(change.value, value);
    const isFocused = change.value.selection.isFocused;
    const isFocusChange = isFocused !== value.selection.isFocused;
    // base our onFocus/onBlur callbacks on Slate value changes, _not_
    // on the Editor's onFocus/onBlur callbacks (which are browser-based).
    // cf. https://github.com/ianstormtaylor/slate/issues/2640#issuecomment-476447608
    // cf. https://github.com/ianstormtaylor/slate/issues/2434#issuecomment-577783398
    isFocusChange && isFocused && onFocus?.(editorRef.current);
    onValueChange?.(change.value);
    isContentChange && onContentChange?.(change.value);
    isFocusChange && !isFocused && onBlur?.(editorRef.current);
  };

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
    />
  );
};
SlateEditor.displayName = "SlateEditor";
export { SlateEditor };
