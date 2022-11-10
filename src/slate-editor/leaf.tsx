import React from "react";
import { RenderLeafProps } from "slate-react";
import { CustomText, MarkType } from "../common/slate-types";
import { isCustomText } from "./slate-utils";


const markComponents: Partial<Record<MarkType, (children: any, leaf: CustomText) => JSX.Element>> = {
  "bold": children => <strong>{children}</strong>,
  "code": children => <code>{children}</code>,
  "deleted": children => <del>{children}</del>,
  "italic": children => <em>{children}</em>,
  "subscript": children => <sub>{children}</sub>,
  "superscript": children => <sup>{children}</sup>,
  "underlined": children => <u>{children}</u>
};
const markTypes = Object.keys(markComponents) as MarkType[];

export function registerMark(mark: MarkType, Component: (children: any, leaf: CustomText) => JSX.Element) {
  markTypes.push(mark);
  markComponents[mark] = Component;
}

export const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  // render the individual marks
  if (isCustomText(leaf)) {
    markTypes.forEach(mark => {
      leaf[mark] && (children = markComponents[mark]?.(children, leaf));
    });
  }

  // The following is a workaround for a Chromium bug where,
  // if you have an inline at the end of a block,
  // clicking the end of a block puts the cursor inside the inline
  // instead of inside the final {text: ''} node
  // https://github.com/ianstormtaylor/slate/issues/4704#issuecomment-1006696364
  const emptyStringPadding = leaf.text === "" ? { paddingLeft: 0.1 } : undefined;
  return <span style={emptyStringPadding} {...attributes}>{children}</span>;
};