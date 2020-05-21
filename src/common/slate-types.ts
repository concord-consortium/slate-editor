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
  heading1 = "heading1",
  heading2 = "heading2",
  heading3 = "heading3",
  heading4 = "heading4",
  heading5 = "heading5",
  heading6 = "heading6",
  blockQuote = "block-quote",
  listItem = "list-item",
  numberedList = "ordered-list",
  bulletedList = "bulleted-list",
  image = "image",

  // inlines
  link = "link"
}

export enum EMetaFormat {
  fontIncrease = "fontIncrease",
  fontDecrease = "fontDecrease"
}

export type ToolFormat = EFormat | EMetaFormat;

export type EditorValue = Value;
export type EditorContent = Document;

export function textToSlate(text: string): EditorValue {
  // cast to any required as typings don't account for string shortcut
  return SlatePlainSerializer.deserialize(text, { defaultBlock: "paragraph" } as any);
}

export function slateToText(value?: EditorValue): string {
  return value ? SlatePlainSerializer.serialize(value) : "";
}
