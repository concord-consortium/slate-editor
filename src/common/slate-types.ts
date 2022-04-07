import { Range, Value } from "slate";
import SlatePlainSerializer from "slate-plain-serializer";

// eslint-disable-next-line no-shadow
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

export const kSlateVoidClass = "cc-slate-void";

// eslint-disable-next-line no-shadow
export enum EMetaFormat {
  fontIncrease = "fontIncrease",
  fontDecrease = "fontDecrease"
}

export type ToolFormat = EFormat | EMetaFormat;

export type EditorValue = Value;
export type EditorContent = Document;
export const EditorRange = Range;

const markFormats: Array<EFormat | string> = [
  EFormat.bold, EFormat.italic, EFormat.underlined, EFormat.inserted, EFormat.deleted,
  EFormat.code, EFormat.marked, EFormat.superscript, EFormat.subscript, EFormat.color
];

export function registerMarkFormat(format: string) {
  markFormats.push(format);
}

export function isMarkFormat(format: EFormat | string) {
  return markFormats.includes(format);
}

const blockFormats: Array<EFormat | string> = [
  EFormat.paragraph, EFormat.block, EFormat.blockQuote, EFormat.heading1, EFormat.heading2,
  EFormat.heading3, EFormat.heading4, EFormat.heading5, EFormat.heading6, EFormat.horizontalRule,
  EFormat.preformatted, EFormat.listItem, EFormat.numberedList, EFormat.bulletedList, EFormat.lineDEPRECATED
];

export function registerBlockFormat(format: string) {
  blockFormats.push(format);
}

export function isBlockFormat(format: EFormat) {
  return blockFormats.includes(format);
}

const inlineFormats: Array<EFormat | string> = [EFormat.inline, EFormat.image, EFormat.link];

export function registerInlineFormat(format: string) {
  inlineFormats.push(format);
}

export function isInlineFormat(format: EFormat) {
  return inlineFormats.includes(format);
}

export function textToSlate(text: string): EditorValue {
  // cast to any required as typings don't account for string shortcut
  return SlatePlainSerializer.deserialize(text, { defaultBlock: EFormat.defaultBlock } as any);
}

export function slateToText(value?: EditorValue): string {
  return value ? SlatePlainSerializer.serialize(value) : "";
}
