import { Descendant, BaseEditor, Node } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';
import { IDialogController } from '../modal-dialog/dialog-types';

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
  link = "link", // <a>
  variable = "variable" // FIXME: just her temporarily
}

export type EditorValue = Descendant[];

export function textToSlate(contents: string): EditorValue {
  const lines = contents.split(/\r|\r?\n/);
  // FIXME: not done yet.
  return lines.map(line => ({ type: "paragraph", children: [{ text: line }] }));
}

export function slateToText(value?: EditorValue): string {
  return value? value.map(n => Node.string(n)).join("\n"): '';
}

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

// FIXME: MOVE THIS
export type VariableElement = { type: 'variable'; name: string; value: string; children: Descendant[] };

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
  | VariableElement // FIXME: MOve this
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