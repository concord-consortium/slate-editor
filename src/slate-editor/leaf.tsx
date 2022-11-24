import React from "react";
import { RenderLeafProps } from "slate-react";
import { CustomText, MarkType } from "../common/custom-types";
import { isCustomText } from "../common/slate-utils";

const markRenderMap: Record<string, (children: any, leaf: CustomText) => JSX.Element> = {
  "bold": children => <strong>{children}</strong>,
  "code": children => <code>{children}</code>,
  "deleted": children => <del>{children}</del>,
  "italic": children => <em>{children}</em>,
  "subscript": children => <sub>{children}</sub>,
  "superscript": children => <sup>{children}</sup>,
  "underlined": children => <u>{children}</u>
};
const markTypes = Object.keys(markRenderMap);

export function registerMark(mark: MarkType, render: (children: any, leaf: CustomText) => JSX.Element) {
  markTypes.push(mark);
  markRenderMap[mark] = render;
}

export const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (isCustomText(leaf)) {
    markTypes.forEach(mark => {
      (leaf as CustomText)[mark as MarkType] && (children = markRenderMap[mark](children, leaf));
    });
  }

  return <span {...attributes}>{children}</span>;
};
