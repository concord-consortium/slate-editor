import { Value } from "slate";
import SlatePlainSerializer from "slate-plain-serializer";

export enum EFormat {
  // marks
  bold = "bold",
  italic = "italic",
  underlined = "underlined",
  deleted = "deleted",
  code = "code",
  superscript = "superscript",
  subscript = "subscript",
  color = "color",

  // blocks
  paragraph = "paragraph",
  heading1 = "heading1",
  heading2 = "heading2",
  heading3 = "heading3",
  heading4 = "heading4",
  heading5 = "heading5",
  heading6 = "heading6",
  horizontalRule = "horizontal-rule",
  blockQuote = "block-quote",
  listItem = "list-item",
  numberedList = "ordered-list",
  bulletedList = "bulleted-list",

  // inlines
  image = "image",
  link = "link"
}

export enum EMetaFormat {
  fontIncrease = "fontIncrease",
  fontDecrease = "fontDecrease"
}

export type ToolFormat = EFormat | EMetaFormat;

export type EditorValue = Value;
export type EditorContent = Document;

export function isMarkFormat(format: EFormat) {
  return [EFormat.bold, EFormat.italic, EFormat.underlined, EFormat.deleted,
          EFormat.code, EFormat.superscript, EFormat.subscript, EFormat.color]
          .includes(format);
}

export function isBlockFormat(format: EFormat) {
  return [EFormat.paragraph, EFormat.heading1, EFormat.heading2, EFormat.heading3, EFormat.heading4,
          EFormat.heading5, EFormat.heading6, EFormat.horizontalRule, EFormat.blockQuote, EFormat.listItem,
          EFormat.numberedList, EFormat.bulletedList]
          .includes(format);
}

export function isInlineFormat(format: EFormat) {
  return [EFormat.image, EFormat.link].includes(format);
}

export function textToSlate(text: string): EditorValue {
  // cast to any required as typings don't account for string shortcut
  return SlatePlainSerializer.deserialize(text, { defaultBlock: "paragraph" } as any);
}

export function slateToText(value?: EditorValue): string {
  return value ? SlatePlainSerializer.serialize(value) : "";
}
