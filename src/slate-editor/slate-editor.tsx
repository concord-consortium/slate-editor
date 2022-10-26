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
  Editor,
  //Transforms,
  Descendant,
  //Element as SlateElement,
} from 'slate';

import { withHistory } from 'slate-history';
import './slate-editor.scss';
import { createEditor } from '../common/create-editor';

export interface EditorSelectionJson {
  anchor: number;
  focus: number;
}

export interface IProps {
  className?: string;
  value?: Descendant[] | string;
  children?: any;
  toolbar1: toolbar1;
  //placeholder?: string;
  // readOnly?: boolean;
  // hotkeyMap?: HotkeyMap;
  // plugins?: Plugins<Editor>;
  // history?: boolean | IEditorHistoryOptions;
  // onEditorRef?: (editorRef?: Editor) => void;
  // onLoad?: (node: Node) => void;
  // onValueChange?: (value: EditorValue) => void;
  // onContentChange?: (value: EditorValue) => void;
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

// function extractUserDataJSON(value: Value) {
//   const { data: _data } = value.toJSON({ preserveData: true });
//   const { undos, redos, ...others } = _data || {};
//   return size(_data) ? { data: {...others} } : undefined;
// }
// function isValueDataChange(value1: Value, value2: Value) {
//   return !isEqual(extractUserDataJSON(value1), extractUserDataJSON(value2));
// }

// const defaultPlugins: Plugin<Editor>[] = [
//         CoreMarksPlugin(), ColorPlugin(),                   // marks
//         ImagePlugin(), LinkPlugin(), CoreInlinesPlugin(),   // inlines
//         ListPlugin(), TablePlugin(), CoreBlocksPlugin(),    // blocks
//         FontSizePlugin()
//       ];

const HOTKEYS: Record<string, string> = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
};

// const LIST_TYPES: string[] = ['numbered-list', 'bulleted-list'];
// const TEXT_ALIGN_TYPES:string[] = ['left', 'center', 'right', 'justify'];

const SlateEditor: React.FC<IProps> = (props: IProps) => {
  // const {
  //   history, onEditorRef, onLoad, onValueChange, onContentChange, onFocus, onBlur, placeholder, plugins, readOnly
  // } = props;
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
    <Slate editor={editor} value={value}>
      {props.children}
      {props.toolbar1}
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

// const toggleBlock = (editor:Editor, format:any) => {
//   const isActive = isBlockActive(
//     editor,
//     format,
//     TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
//   );
//   const isList = LIST_TYPES.includes(format);

//   Transforms.unwrapNodes(editor, {
//     match: n =>
//       !Editor.isEditor(n) &&
//       SlateElement.isElement(n) &&
//       LIST_TYPES.includes(n.type) &&
//       !TEXT_ALIGN_TYPES.includes(format),
//     split: true,
//   });
//   let newProperties: Partial<SlateElement>;
//   if (TEXT_ALIGN_TYPES.includes(format)) {
//     newProperties = {
//       align: isActive ? undefined : format,
//     };
//   } else {
//     newProperties = {
//       type: isActive ? 'paragraph' : isList ? 'list-item' : format,
//     };
//   }
//   Transforms.setNodes<SlateElement>(editor, newProperties)

//   if (!isActive && isList) {
//     const block = { type: format, children: [] };
//     Transforms.wrapNodes(editor, block);
//   }
// }

const toggleMark = (editor:Editor, format:any) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

// const isBlockActive = (editor:Editor, format:any, blockType = 'type') => {
//   const { selection } = editor
//   if (!selection) return false

//   const [match] = Array.from(
//     Editor.nodes(editor, {
//       at: Editor.unhangRange(editor, selection),
//       match: n =>
//         !Editor.isEditor(n) &&
//         SlateElement.isElement(n) &&
//         (n as any)[blockType] === format,
//     })
//   );
//   return !!match;
// }

const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor) as CustomMarks;
  return !!marks?.[format as MarkType];
};

const Element = ({ attributes, children, element }:any) => {
  const style = { textAlign: element.align };
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case 'bulleted-list':
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case 'heading-one':
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case 'numbered-list':
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};
const markRenderMap: Record<string, (children: any, leaf: CustomText) => React.ReactNode> = {
  "bold": children => <strong>{children}</strong>,
  "code": children => <code>{children}</code>,
  "deleted": children => <del>{children}</del>,
  "italic": children => <em>{children}</em>,
  "subscript": children => <sub>{children}</sub>,
  "superscript": children => <sup>{children}</sup>,
  "underlined": children => <u>{children}</u>
};
const markTypes = Object.keys(markRenderMap);

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (isCustomText(leaf)) {
    markTypes.forEach(mark => {
      leaf[mark as MarkType] && (children = markRenderMap[mark](children, leaf));
    });
  }
  return <span {...attributes}>{children}</span>;
};

export function isCustomText(node: CustomText | EmptyText): node is CustomText {
  return !!node.text ||
          !!(node as CustomText).bold || !!(node as CustomText).code || !!(node as CustomText).color ||
          !!(node as CustomText).deleted || !!(node as CustomText).italic || !!(node as CustomText).subscript ||
          !!(node as CustomText).superscript || !!(node as CustomText).underlined;
}

// const initialValue: Descendant[] = [
//   {
//     type: 'paragraph',
//     children: [
//       { text: 'This is editable ' },
//       { text: 'rich', bold: true },
//       { text: ' text, ' },
//       { text: 'much', italic: true },
//       { text: ' better than a ' },
//       { text: '<textarea>', code: true },
//       { text: '!' },
//     ],
//   },
//   {
//     type: 'paragraph',
//     children: [
//       {
//         text:
//           "Since it's rich text, you can do things like turn a selection of text ",
//       },
//       { text: 'bold', bold: true },
//       {
//         text:
//           ', or add a semantically rendered block quote in the middle of the page, like this:',
//       },
//     ],
//   },
//   {
//     type: 'block-quote',
//     children: [{ text: 'A wise quote.' }],
//   },
//   {
//     type: 'paragraph',
//     align: 'center',
//     children: [{ text: 'Try it out for yourself!' }],
//   },
// ];