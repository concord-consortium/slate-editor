import { createElement } from "react";
import { Descendant, Editor } from "slate";
import { jsx } from "slate-hyperscript";
import { CustomElement, isLegacyBlockElement } from "../common/custom-types";
import { EFormat } from "../common/slate-types";
import { registerElementDeserializer } from "../serialization/html-serializer";
import { getElementAttrs } from "../serialization/html-utils";
import { eltRenderAttrs, registerElementComponent } from "../slate-editor/element";

const kTagToFormatMap: Record<string, string> = {
        blockquote: EFormat.blockQuote,
        div: EFormat.block,
        h1: EFormat.heading1,
        h2: EFormat.heading2,
        h3: EFormat.heading3,
        h4: EFormat.heading4,
        h5: EFormat.heading5,
        h6: EFormat.heading6,
        hr: EFormat.horizontalRule,
        p: EFormat.paragraph,
        pre: EFormat.preformatted
      };

const kFormatToTagMap: Record<string, string> = {};

// build the kFormatToTagMap from the kTagToFormatMap
for (const tag in kTagToFormatMap) {
  const format = kTagToFormatMap[tag];
  kFormatToTagMap[format] = tag;
}
kFormatToTagMap[EFormat.lineDEPRECATED] = "p";

// other block tags handled as generic blocks
// https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements
export const kLegacyBlockTags = [
  "address", "article", "aside",
  "dd", "dl", "dt", // description list tags
  "details", "fieldset", "figcaption", "figure",
  "footer", "form", "header", "hgroup", "nav", "section"
];
kLegacyBlockTags.forEach(tag => kTagToFormatMap[tag] = EFormat.block);

// void tags can't have children
const kVoidBlockTags = ["br", "hr"];

let isRegistered = false;

export function registerCoreBlocks() {
  if (isRegistered) return;

  // register a component for each block format
  for (const format in kFormatToTagMap) {
    registerElementComponent(format, ({ element, attributes, children: _children }) => {
      const tag = getTagForBlock(element);
      const children = kVoidBlockTags.includes(tag) ? undefined : _children;
      // console.log("rendering core block:", JSON.stringify(element), "tag:", tag,
      //             "attrs:", JSON.stringify(eltRenderAttrs(element)));
      return createElement(tag, { ...attributes, ...eltRenderAttrs(element) }, children);
    });
  }

  // register a deserializer for each block tag
  for (const tag in kTagToFormatMap) {
    registerElementDeserializer(tag, {
      deserialize: (el: HTMLElement, _children: Descendant[]) => {
        // keep the original tag in the case of legacy block tags so we can use it on export/render
        const legacyTag = kLegacyBlockTags.includes(tag) ? { tag } : undefined;
        const children = kVoidBlockTags.includes(tag) ? undefined : _children;
        return jsx("element", { type: kTagToFormatMap[tag], ...legacyTag, ...getElementAttrs(el) }, children);
      }
    });
  }

  isRegistered = true;
}

export function withCoreBlocks(editor: Editor) {
  registerCoreBlocks();
  return editor;
}

function getTagForBlock(elt: CustomElement) {
  const { type: format } = elt;
  const mappedTag = kFormatToTagMap[format];
  // use the imported tag (if present) for generic <div> elements
  const tag = isLegacyBlockElement(elt) ? elt.tag || mappedTag : mappedTag;
  // default to <div> if no other tag available
  !tag && console.warn("CoreBlocksPlugin", "no tag for block:", elt.type, "defaulting to <div>");
  return tag || "div";
}
