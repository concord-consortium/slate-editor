import { createElement } from "react";
import { Descendant, Editor } from "slate";
import { jsx } from "slate-hyperscript";
import IconHeading from "../assets/icon-heading";
import IconQuote from "../assets/icon-quote";
import { CustomElement, isLegacyBlockElement } from "../common/custom-types";
import { EFormat } from "../common/slate-types";
import { isBlockActive, toggleBlock } from "../common/slate-utils";
import { getPlatformTooltip, registerToolbarButtons } from "../common/toolbar-utils";
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

  registerToolbarButtons(editor, [
    {
      format: EFormat.heading1,
      SvgIcon: IconHeading,
      tooltip: getPlatformTooltip("heading 1"),
      isActive: () => !!editor && isBlockActive(editor, EFormat.heading1),
      onClick: () => toggleBlock(editor, EFormat.heading1)
    },
    {
      format: EFormat.heading2,
      SvgIcon: IconHeading,
      iconSize: 14,
      tooltip: getPlatformTooltip("heading 2"),
      isActive: () => !!editor && isBlockActive(editor, EFormat.heading2),
      onClick: () => toggleBlock(editor, EFormat.heading2)
    },
    {
      format: EFormat.heading3,
      SvgIcon: IconHeading,
      iconSize: 12,
      tooltip: getPlatformTooltip("heading 3"),
      isActive: () => !!editor && isBlockActive(editor, EFormat.heading3),
      onClick: () => toggleBlock(editor, EFormat.heading3)
    },
    // H4-H6 have been removed from the toolbar but are left commented out in case we want to bring them back.
    // {
    //   format: EFormat.heading4,
    //   SvgIcon: IconHeading,
    //   iconSize: 10,
    //   tooltip: getPlatformTooltip("heading 4"),
    //   isActive: () => !!editor && isBlockActive(editor, EFormat.heading4),
    //   onClick: () => toggleBlock(editor, EFormat.heading4)
    // },
    // {
    //   format: EFormat.heading5,
    //   SvgIcon: IconHeading,
    //   iconSize: 8,
    //   tooltip: getPlatformTooltip("heading 5"),
    //   isActive: () => !!editor && isBlockActive(editor, EFormat.heading5),
    //   onClick: () => toggleBlock(editor, EFormat.heading5)
    // },
    // {
    //   format: EFormat.heading6,
    //   SvgIcon: IconHeading,
    //   iconSize: 6,
    //   tooltip: getPlatformTooltip("heading 6"),
    //   isActive: () => !!editor && isBlockActive(editor, EFormat.heading6),
    //   onClick: () => toggleBlock(editor, EFormat.heading6)
    // },
    {
      format: EFormat.blockQuote,
      SvgIcon: IconQuote,
      tooltip: getPlatformTooltip("block quote"),
      isActive: () => !!editor && isBlockActive(editor, EFormat.blockQuote),
      onClick: () => toggleBlock(editor, EFormat.blockQuote)
    }
  ]);

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
