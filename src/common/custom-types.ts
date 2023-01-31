import { Descendant, BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';
import { IDialogController } from '../modal-dialog/dialog-types';
import { EFormat } from './slate-types';

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

export type LegacyBlockElement = {
  type: EFormat.block;
  tag: string;
  attrs: Record<string, string>;
  children: Descendant[];
};

export type LegacyInlineElement = {
  type: EFormat.inline;
  tag: string;
  attrs: Record<string, string>;
  children: Descendant[];
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
  type: 'ordered-list';
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

// plugins can install additional elements unknown to the type system
export type UnknownElement = {
  type: string;
  children: Descendant[];
};

export type CustomElement =
  | BlockQuoteElement
  | BulletedListElement
  // | CheckListItemElement
  | EditableVoidElement
  | HeadingElement
  | HeadingTwoElement
  | ImageElement
  | LegacyBlockElement
  | LegacyInlineElement
  | LinkElement
  | ButtonElement
  | ListItemElement
  // | MentionElement
  | NumberedListElement
  | ParagraphElement
  // | TableElement
  // | TableRowElement
  // | TableCellElement
  // | TitleElement
  | UnknownElement;
  // | VideoElement

export type CustomText = {
  bold?: boolean;
  code?: boolean;
  color?: string;
  deleted?: boolean;
  inserted?: boolean;
  italic?: boolean;
  marked?: boolean;
  subscript?: boolean;
  superscript?: boolean;
  underlined?: boolean;
  text: string;
};
export type CustomMarks = Omit<CustomText, "text">;
export type MarkType = keyof CustomMarks;

export type BooleanMarks = Omit<CustomMarks, "color">;
export type BooleanMarkType = keyof BooleanMarks;

export type EmptyText = {
  text: "";
};

export interface CustomRenderLeafProps {
  children: any;
  leaf: CustomText;
}

interface CCBaseEditor extends BaseEditor {
  // document-level metadata (e.g. font-size/zoom level)
  data?: Record<string, boolean | number | string>;
  // plugins can store values in maps under the plugin name
  plugins: Record<string, Record<string, any>>;
  isMarkActive: (format: string) => boolean;
  toggleMark: (format: string, value?: any) => void;
  toggleSuperSubscript: (format: EFormat.subscript | EFormat.superscript) => void;
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

export const isLeafTextNode = (n: Descendant): n is CustomText | EmptyText =>
              (n as any).text != null && (n as any).children == null;
export const isLegacyBlockElement = (e: CustomElement): e is LegacyBlockElement => e.type === EFormat.block;
export const isLegacyInlineElement = (e: CustomElement): e is LegacyInlineElement => e.type === EFormat.inline;
