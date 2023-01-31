import { createElement } from "react";
import { Descendant, Editor } from "slate";
import { jsx } from "slate-hyperscript";
import { CustomElement, isLegacyBlockElement } from "../common/custom-types";
import { EFormat } from "../common/slate-types";
import { registerElementDeserializer } from "../serialization/html-serializer";
import { getElementAttrs } from "../serialization/html-utils";
import { eltRenderAttrs, registerElementComponent } from "../slate-editor/element";
/*
import React, { ReactNode } from "react";
import { Block, Node } from "slate";
import { Editor, RenderAttributes, RenderBlockProps, EventHook } from "slate-react";
import { getRenderAttributesFromNode, getDataFromElement } from "../serialization/html-utils";
import { EFormat } from "../common/slate-types";
import { hasBlock } from "../slate-editor/slate-utils";
import { HtmlSerializablePlugin } from "./html-serializable-plugin";

function renderBlockAsTag(tag: string, block: Block, attributes: RenderAttributes,
                          children: ReactNode, isSerializing = false) {
  const _children = tag === "hr" ? undefined : children;
  return React.createElement(tag, attributes, _children);
}
*/

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
  // use the imported tag for generic <div> elements
  return isLegacyBlockElement(elt) ? elt.tag || mappedTag : mappedTag;
}

/*
function getDataFromBlockElement(el: Element) {
  const tag = el.tagName.toLowerCase();
  const dataObj = getDataFromElement(el, { tag });
  // convert <center> tag to center alignment property
  if (tag === "center") {
    dataObj?.data && (dataObj.data.align = "center");
  }
  return dataObj;
}

function getRenderAttributesFromBlock(block: Block): RenderAttributes {
  const isCenterTag = (block.type === EFormat.block) &&
                        (block.data.get("tag") === "center");
  const omits = ["tag", ...(isCenterTag ? ["align"] : [])];
  return getRenderAttributesFromNode(block, omits);
}

/**
 * On return/enter, navigate to next/previous cell if inside a table cell.
 *
 * @param {Event} event
 * @param {Editor} editor
 *\/

const handleEnter: EventHook<React.KeyboardEvent> = (event, editor, next) => {
  // placeholder for any further special-case treatment
  return next();
};

export function CoreBlocksPlugin(): HtmlSerializablePlugin {
  return {
    deserialize: function(el, next) {
      const tag = el.tagName.toLowerCase();
      const format = kTagToFormatMap[tag];
      if (format) {
        return {
          object: "block",
          type: format,
          ...getDataFromBlockElement(el),
          nodes: next(el.childNodes),
        };
      }
    },
    serialize: function(obj, children) {
      const tag = getTagForBlock(obj);
      if (tag) {
        const node: Block = obj;
        const attributes = getRenderAttributesFromBlock(node);
        return renderBlockAsTag(tag, node, attributes, children, true);
      }
    },

    onCommand(command, editor, next) {
      const { type, args } = command;
      if (type === "toggleBlock") {
        const format = args?.[0];
        if (format && kFormatToTagMap[format]) {
          editor.setBlocks(hasBlock(editor.value, format) ? EFormat.defaultBlock : format);
          return;
        }
      }
      return next();
    },

    onKeyDown: (event, editor, next) => {
      switch (event.key) {
        case 'Enter':
          return handleEnter(event, editor, next);
        default:
          return next();
      }
    },

    renderBlock: (props: RenderBlockProps, editor: Editor, next: () => any) => {
      const { attributes, children, node } = props;
      const tag = getTagForBlock(node);
      return tag
              ? renderBlockAsTag(tag, node, { ...getRenderAttributesFromBlock(node), ...attributes }, children)
              : next();
    }

  };
}
*/
