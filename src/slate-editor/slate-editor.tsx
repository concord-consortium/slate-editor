// import React, { useCallback, useMemo, useRef } from "react";
// import { Editor, OnChangeParam, Plugins } from "slate-react";
// import { Node, Plugin, Value } from "slate";
// import find from "lodash/find";
// import isEqual from "lodash/isEqual";
// import size from "lodash/size";
// import { HotkeyMap, useHotkeyMap } from "../common/slate-hooks";
// import { ColorPlugin } from "../plugins/color-plugin";
// import { CoreBlocksPlugin } from "../plugins/core-blocks-plugin";
// import { CoreInlinesPlugin } from "../plugins/core-inlines-plugin";
// import { CoreMarksPlugin } from "../plugins/core-marks-plugin";
// import { EditorHistory, IOptions as IEditorHistoryOptions, NoEditorHistory } from "../plugins/editor-history";
// import { EmitterPlugin} from "../plugins/emitter-plugin";
// import { FontSizePlugin, getFontSize } from "../plugins/font-size-plugin";
// import { ImagePlugin } from "../plugins/image-plugin";
// import { LinkPlugin } from "../plugins/link-plugin";
// import { ListPlugin } from "../plugins/list-plugin";
// import { OnLoadPlugin } from "../plugins/on-load-plugin";
// import { TablePlugin } from "../plugins/table-plugin";
import React, { useCallback, useMemo } from 'react';
import isHotkey from 'is-hotkey';
import {CustomMarks, CustomText, MarkType, EmptyText, textToSlate } from "../common/slate-types";
import { Editable, withReact, Slate, RenderLeafProps} from 'slate-react';
import {
  Descendant,
  Element as SlateElement,
} from 'slate';
import {toggleMark, toggleBlock} from './slate-utils';

import { withHistory } from 'slate-history';
import './slate-editor.scss';
import { createEditor } from '../common/create-editor';
import { Leaf } from './leaf';
import { Element } from './element';


export interface EditorSelectionJson {
  anchor: number;
  focus: number;
}

export interface IProps {
  className?: string;
  value?: Descendant[] | string;
  children?: any;
  onChange?: (value: any) => void;
  //placeholder?: string;
  // readOnly?: boolean;
  // hotkeyMap?: HotkeyMap;
  // plugins?: Plugins<Editor>;
  // history?: boolean | IEditorHistoryOptions;
  // onEditorRef?: (editorRef?: Editor) => void;
  // onLoad?: (node: Node) => void;
  // onFocus?: (editor?: Editor) => void;
  // onBlur?: (editor?: Editor) => void;
  // style?: React.CSSProperties;
}

const kEmptyEditorValue = textToSlate("");
// const kDefaultHotkeyMap = {
//         'mod+b': (editor: Editor) => editor.toggleMark(EFormat.bold),
//         'mod+i': (editor: Editor) => editor.toggleMark(EFormat.italic),
//         'mod+u': (editor: Editor) => editor.toggleMark(EFormat.underlined)
//       };

const HOTKEYS: Record<string, string> = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
};


const SlateEditor: React.FC<IProps> = (props: IProps) => {
  // const {
  //   history, onEditorRef, onLoad, onValueChange, onContentChange, onFocus, onBlur, placeholder, plugins, readOnly
  // } = props;
  const {onChange} = props;
  // const emitterPlugin = useMemo(() => EmitterPlugin(), []);
  // const onLoadPlugin = useMemo(() => OnLoadPlugin(onLoad), [onLoad]);
  // const historyPlugin = useMemo(() => history || (history == null)  // enabled by default
  //                                       ? EditorHistory(typeof history === "object" ? history : undefined)
  //                                       : NoEditorHistory(), [history]);
  // const allPlugins = useMemo(() => [...(plugins || []), ...defaultPlugins, emitterPlugin, onLoadPlugin, historyPlugin],
  //                           [plugins, emitterPlugin, onLoadPlugin, historyPlugin]);
  // const editorRef = useRef<Editor>();
  const value = typeof props.value === "string" ?
                  textToSlate(props.value)
                   : props.value || kEmptyEditorValue;

  // const fontSize = getFontSize(value);
  // const fontStyle = fontSize ? {fontSize: `${fontSize}em`} : undefined;
  // const style = { ...props.style, ...fontStyle };

  // const handleChange = (change: OnChangeParam) => {
  //   const isContentChange = (change.value.document !== value.document) ||
  //                             isValueDataChange(change.value, value);
  //   const isFocused = change.value.selection.isFocused;
  //   const isFocusChange = isFocused !== value.selection.isFocused;
  //   // base our onFocus/onBlur callbacks on Slate value changes, _not_
  //   // on the Editor's onFocus/onBlur callbacks (which are browser-based).
  //   // cf. https://github.com/ianstormtaylor/slate/issues/2640#issuecomment-476447608
  //   // cf. https://github.com/ianstormtaylor/slate/issues/2434#issuecomment-577783398
  //   isFocusChange && isFocused && onFocus?.(editorRef.current);
  //   onValueChange?.(change.value);
  //   isContentChange && onContentChange?.(change.value);
  //   isFocusChange && !isFocused && onBlur?.(editorRef.current);
  // };

  // const hotkeyFnMap = useHotkeyMap(props.hotkeyMap || kDefaultHotkeyMap);
  // const handleKeyDown = useCallback((e: React.KeyboardEvent<Element>, editor: Editor, next: () => any) => {
  //   const found = find(hotkeyFnMap, entry => {
  //     return entry.isHotkey(e.nativeEvent);
  //   });
  //   if (!found) return next();
  //   e.preventDefault();
  //   found.invoker(editor);
  // }, [hotkeyFnMap]);

  // const handleEditorRef = useCallback((editor: Editor | null) => {
  //   editorRef.current = editor || undefined;
  //   onEditorRef?.(editorRef.current);
  // }, [onEditorRef]);


  const renderElement = useCallback((propsb: any) => <Element {...propsb} />, []);
  const renderLeaf = useCallback((propsb:any) => <Leaf {...propsb} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  //const [value, setValue] = useState<Descendant[]>([{ type: 'paragraph', children: [{ text: '' }] }])
  return (
    <Slate
      editor={editor}
      value={value}
      onChange={onChange}
      >
      {props.children}
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        onKeyDown={(event:any) => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event as any)) {
              event.preventDefault();
              const mark = HOTKEYS[hotkey];
              toggleMark(editor, mark);
            }
          }
        }}
      />
  </Slate>
  );
};
SlateEditor.displayName = "SlateEditor";
export { SlateEditor };