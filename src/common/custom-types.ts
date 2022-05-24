import { Descendant, BaseEditor } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';
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
  url: string;
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
  text: string;
};

export interface CustomRenderLeafProps {
  children: any;
  leaf: CustomText;
}

export type RenderElementAttrs = RenderElementProps["attributes"];

interface CCBaseEditor extends BaseEditor {
  isMarkActive: (format: string) => boolean;
  toggleMark: (format: string, value: any) => void;
  isElementActive: (format: string) => boolean;
  toggleElement: (format: string) => void;

  selectedElements: () => CustomElement[];

  isElementEnabled: (format: string) => boolean;
  configureElement: (format: string, controller: IDialogController) => void;
}

export type CustomEditor = CCBaseEditor & ReactEditor & HistoryEditor;

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText | EmptyText;
  }
}
