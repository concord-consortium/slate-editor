import { Descendant, Editor } from "slate";

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

// eslint-disable-next-line no-shadow
export enum EMetaFormat {
  fontIncrease = "fontIncrease",
  fontDecrease = "fontDecrease"
}

export type EditorValue = Descendant[];

export type HotkeyMap = Record<string, (editor: Editor) => void>;

export function textToSlate(text: string): EditorValue {
  const lines = text.split(/\r|\r?\n/);
  return lines.map(line => ({ type: "paragraph", children: [{ text: line }] }));
}
