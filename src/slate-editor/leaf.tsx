import React from "react";
import { RenderLeafProps } from "slate-react";
import { CustomText } from "../common/custom-types";
import { isCustomText } from "../common/slate-utils";
import { useSerializing } from "../hooks/use-serializing";

type MarkRenderer = (children: any, leaf: CustomText) => JSX.Element;
const markRenderers: MarkRenderer[] = [];

export function registerMarkRenderer(renderFn: (children: any, leaf: CustomText) => JSX.Element) {
  markRenderers.push(renderFn);
}

export const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  const isSerializing = useSerializing();

  // render the individual marks
  if (isCustomText(leaf)) {
    markRenderers.forEach(renderFn => {
      children = renderFn(children, leaf);
    });
  }

  // The following is a workaround for a Chromium bug where,
  // if you have an inline at the end of a block,
  // clicking the end of a block puts the cursor inside the inline
  // instead of inside the final {text: ''} node
  // https://github.com/ianstormtaylor/slate/issues/4704#issuecomment-1006696364
  const emptyStringPadding = !isSerializing && leaf.text === "" ? { paddingLeft: 0.1 } : undefined;
  return !isSerializing
    ? <span style={emptyStringPadding} {...attributes}>{children}</span>
    : children;
};
