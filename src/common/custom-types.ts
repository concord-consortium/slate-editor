import { Descendant, BaseEditor, BaseElement, Node } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';
import { IDialogController } from '../modal-dialog/dialog-types';
import { EFormat } from './slate-types';

export interface BlockQuoteElement extends BaseElement {
  type: 'block-quote';
  align?: string;
}

export interface BulletedListElement extends BaseElement {
  type: 'bulleted-list';
  align?: string;
}

// export interface CheckListItemElement extends BaseElement {
//   type: 'check-list-item';
//   checked: boolean;
// };

export interface EditableVoidElement extends BaseElement {
  type: 'editable-void';
  children: EmptyText[];
}

export interface HeadingElement extends BaseElement {
  type: 'heading-one';
  align?: string;
}

export interface HeadingTwoElement extends BaseElement {
  type: 'heading-two';
  align?: string;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  constrain?: boolean;
  float?: 'left' | 'right';
  children: EmptyText[];
}

export interface LegacyBlockElement extends BaseElement {
  type: EFormat.block;
  tag: string;
  attrs: Record<string, string>;
}

export interface LegacyInlineElement extends BaseElement {
  type: EFormat.inline;
  tag: string;
  attrs: Record<string, string>;
}

export interface LinkElement extends BaseElement {
  type: 'link';
  href: string;
}

export interface ButtonElement extends BaseElement {
  type: 'button';
}

export interface ListItemElement extends BaseElement {
  type: 'list-item';
}

// export interface MentionElement extends BaseElement {
//   type: 'mention';
//   character: string;
//   children: CustomText[];
// };

export interface NumberedListElement extends BaseElement {
  type: 'ordered-list';
  align?: string;
}

export interface ParagraphElement extends BaseElement {
  type: 'paragraph';
  align?: string;
}

// export interface TableElement extends BaseElement { type: 'table'; children: TableRow[] }

// export interface TableCellElement extends BaseElement { type: 'table-cell'; children: CustomText[] }

// export interface TableRowElement extends BaseElement { type: 'table-row'; children: TableCell[] }

// export interface TitleElement extends BaseElement { type: 'title'; children: Descendant[] }

// export interface VideoElement extends BaseElement { type: 'video'; url: string; children: EmptyText[] }

// plugins can install additional elements unknown to the type system
export interface UnknownElement extends BaseElement {
  type: string;
}

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

// type guard for whether a Node is an Element
export function isCustomElement(elt: Node): elt is CustomElement {
  return "children" in elt && Array.isArray(elt.children) &&
          "type" in elt && elt.type != null;
}

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
  configureElement: (format: string, controller?: IDialogController, elt?: CustomElement) => void;
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
