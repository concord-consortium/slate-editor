// import { Range, Value } from "slate";
// import SlatePlainSerializer from "slate-plain-serializer";

export enum EFormat {
  // marks
  bold = "bold",
  italic = "italic",
  underlined = "underlined",
  inserted = "inserted",
  deleted = "deleted",
  code = "code",
  marked = "marked",
  superscript = "superscript",
  subscript = "subscript",
  color = "color",

  // blocks
  defaultBlock = "paragraph",

  block = "block",  // generic block (<div>)
  blockQuote = "block-quote",
  heading1 = "heading1",
  heading2 = "heading2",
  heading3 = "heading3",
  heading4 = "heading4",
  heading5 = "heading5",
  heading6 = "heading6",
  horizontalRule = "horizontal-rule",
  paragraph = "paragraph",
  preformatted = "preformatted",

  listItem = "list-item",
  numberedList = "ordered-list",
  bulletedList = "bulleted-list",

  // legacy predecessors used "line" instead of "paragraph"
  lineDEPRECATED = "line",

  // inlines
  inline = "inline",  // generic inline (<span>)
  image = "image",
  link = "link" // <a>
}

export type EditorValue = Descendant[];
// export const kSlateVoidClass = "cc-slate-void";

// // eslint-disable-next-line no-shadow
// export enum EMetaFormat {
//   fontIncrease = "fontIncrease",
//   fontDecrease = "fontDecrease"
// }

//export type ToolFormat = EFormat | EMetaFormat;

// export type EditorValue = Value;
// export type EditorContent = Document;
// export const EditorRange = Range;

// const markFormats: Array<EFormat | string> = [
//   EFormat.bold, EFormat.italic, EFormat.underlined, EFormat.inserted, EFormat.deleted,
//   EFormat.code, EFormat.marked, EFormat.superscript, EFormat.subscript, EFormat.color
// ];

// export function registerMarkFormat(format: string) {
//   markFormats.push(format);
// }

// export function isMarkFormat(format: EFormat | string) {
//   return markFormats.includes(format);
// }

// const blockFormats: Array<EFormat | string> = [
//   EFormat.paragraph, EFormat.block, EFormat.blockQuote, EFormat.heading1, EFormat.heading2,
//   EFormat.heading3, EFormat.heading4, EFormat.heading5, EFormat.heading6, EFormat.horizontalRule,
//   EFormat.preformatted, EFormat.listItem, EFormat.numberedList, EFormat.bulletedList, EFormat.lineDEPRECATED
// ];

// export function registerBlockFormat(format: string) {
//   blockFormats.push(format);
// }

// export function isBlockFormat(format: EFormat) {
//   return blockFormats.includes(format);
// }

// const inlineFormats: Array<EFormat | string> = [EFormat.inline, EFormat.image, EFormat.link];

// export function registerInlineFormat(format: string) {
//   inlineFormats.push(format);
// }

// export function isInlineFormat(format: EFormat) {
//   return inlineFormats.includes(format);
// }

export function textToSlate(contents: string): Descendant[] {
  console.log('text to slate is broken');
  const value: Descendant[] = [
    {
      type: 'paragraph',
      children: [
        { text: contents},
        { text: 'plus some extra filler'},
      ],
    },
  ];
  return value;
}

// export function slateToText(value?: EditorValue): string {
//   return value ? SlatePlainSerializer.serialize(value) : "";
// }
import { Descendant, BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';
import { IDialogController } from '../modal-dialog/dialog-types';

export type BlockQuoteElement = {
  type: 'block-quote';
  align?: string;
  children: Descendant[];
};

export type BulletedListElement = {
  type: 'bulleted-list';
  align?: string;
  children: Descendant[];
};

// export type CheckListItemElement = {
//   type: 'check-list-item';
//   checked: boolean;
//   children: Descendant[];
// };

export type EditableVoidElement = {
  type: 'editable-void';
  children: EmptyText[];
};

export type HeadingElement = {
  type: 'heading-one';
  align?: string;
  children: Descendant[];
};

export type HeadingTwoElement = {
  type: 'heading-two';
  align?: string;
  children: Descendant[];
};

export type ImageElement = {
  type: 'image';
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  constrain?: boolean;
  float?: 'left' | 'right';
  children: EmptyText[];
};

export type LinkElement = { type: 'link'; href: string; children: Descendant[] };

export type ButtonElement = { type: 'button'; children: Descendant[] };

export type ListItemElement = { type: 'list-item'; children: Descendant[] };

// export type MentionElement = {
//   type: 'mention';
//   character: string;
//   children: CustomText[];
// };

export type NumberedListElement = {
  type: 'numbered-list';
  align?: string;
  children: Descendant[];
};

export type ParagraphElement = {
  type: 'paragraph';
  align?: string;
  children: Descendant[];
};

// export type TableElement = { type: 'table'; children: TableRow[] }

// export type TableCellElement = { type: 'table-cell'; children: CustomText[] }

// export type TableRowElement = { type: 'table-row'; children: TableCell[] }

// export type TitleElement = { type: 'title'; children: Descendant[] };

// export type VideoElement = { type: 'video'; url: string; children: EmptyText[] };

export type CustomElement =
  | BlockQuoteElement
  | BulletedListElement
  // | CheckListItemElement
  | EditableVoidElement
  | HeadingElement
  | HeadingTwoElement
  | ImageElement
  | LinkElement
  | ButtonElement
  | ListItemElement
  // | MentionElement
  | NumberedListElement
  | ParagraphElement;
  // | TableElement
  // | TableRowElement
  // | TableCellElement
  // | TitleElement
  // | VideoElement;

export type CustomText = {
  bold?: boolean;
  code?: boolean;
  color?: string;
  deleted?: boolean;
  italic?: boolean;
  subscript?: boolean;
  superscript?: boolean;
  underlined?: boolean;
  text: string;
};
export type CustomMarks = Omit<CustomText, "text">;
export type MarkType = keyof CustomMarks;

export type EmptyText = {
  text: "";
};

export interface CustomRenderLeafProps {
  children: any;
  leaf: CustomText;
}

interface CCBaseEditor extends BaseEditor {
  isMarkActive: (format: string) => boolean;
  toggleMark: (format: string, value: any) => void;
  isElementActive: (format: string) => boolean;
  toggleElement: (format: string) => void;

  selectedElements: () => CustomElement[];

  isElementEnabled: (format: string) => boolean;
  configureElement: (format: string, controller: IDialogController, elt?: CustomElement) => void;

  emitEvent: (event: string, ...args: any[]) => void;
  onEvent: (event: string, handler: (...args: any[]) => void) => void;
  offEvent: (event: string, handler: (...args: any[]) => void) => void;
}

export type CustomEditor = CCBaseEditor & ReactEditor & HistoryEditor;

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText | EmptyText;
  }
}