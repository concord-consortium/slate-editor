import React, { ReactNode } from "react";
import { Inline, Node } from "slate";
import { Editor, RenderAttributes, RenderInlineProps } from "slate-react";
import { getRenderAttributesFromNode, getDataFromElement } from "../serialization/html-utils";
import { EFormat } from "../common/slate-types";
import { HtmlSerializablePlugin } from "./html-serializable-plugin";

const kTagToFormatMap: Record<string, string> = {
        span: EFormat.inline
      };

const kFormatToTagMap: Record<string, string> = {};

// build the kFormatToTagMap from the kTagToFormatMap
for (const tag in kTagToFormatMap) {
  const format = kTagToFormatMap[tag];
  kFormatToTagMap[format] = tag;
}

// legacy tags (https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements)
// empty in the HTML element sense - not allowed to have child elements
export const kLegacyEmptyInlineTags = [
  "embed", "input"
];
// void in the Slate sense of not having editable contents
const kLegacyVoidNonEmptyInlineTags = [
  "audio", "iframe", "picture", "script", "style", "video"
];
export const kLegacyContentInlineTags = [
  "abbr", "acronym", "big", "cite", "dfn", "font", "label", "q", "samp", "small"
];
export const kLegacyNonEmptyInlineTags = [...kLegacyContentInlineTags, ...kLegacyVoidNonEmptyInlineTags];
export const kLegacyVoidInlineTags = [...kLegacyEmptyInlineTags, ...kLegacyVoidNonEmptyInlineTags];
export const kLegacyInlineTags = [...kLegacyContentInlineTags, ...kLegacyVoidInlineTags];

// other block tags handled as generic blocks
kLegacyInlineTags.forEach(tag => kTagToFormatMap[tag] = EFormat.inline);

function isCoreInline(node: Node) {
  return Inline.isInline(node) && !!kFormatToTagMap[node.type];
}

export function getTagForInline(node: Node): string | undefined {
  if (!Inline.isInline(node) || !isCoreInline(node)) return undefined;
  const { type: format, data } = node;
  return data.get("tag") || kFormatToTagMap[format];
}

function isVoidInline(node: Node) {
  if (isCoreInline(node)) {
    const tag = getTagForInline(node);
    if (tag && kLegacyVoidInlineTags.includes(tag)) {
      return true;
    }
  }
  return false;
}

function getDataFromInlineElement(el: Element) {
  const tag = el.tagName.toLowerCase();
  return getDataFromElement(el, { tag });
}

function getRenderAttributesFromInline(inline: Inline): RenderAttributes {
  return getRenderAttributesFromNode(inline, ["tag"]);
}

function renderInlineAsTag(tag: string, inline: Inline, attributes: RenderAttributes,
                            children: ReactNode, isSerializing = false) {
  const _children = kLegacyEmptyInlineTags.includes(tag) ? null : children;
  return React.createElement(tag, attributes, _children);
}

export function CoreInlinesPlugin(): HtmlSerializablePlugin {
  return {
    deserialize: function(el, next) {
      const tag = el.tagName.toLowerCase();
      const format = kTagToFormatMap[tag];
      if (format) {
        return {
          object: "inline",
          type: format,
          ...getDataFromInlineElement(el),
          nodes: next(el.childNodes),
        };
      }
    },
    serialize: function(obj, children) {
      const tag = getTagForInline(obj);
      if (tag) {
        const inline: Inline = obj;
        const attributes = getRenderAttributesFromInline(inline);
        return renderInlineAsTag(tag, inline, attributes, children, true);
      }
    },

    onQuery: (query, editor, next) => {
      if (query.type === "isVoid") {
        const node: Node = query.args[0];
        if (isCoreInline(node)) {
          return isVoidInline(node);
        }
      }
      return next();
    },
  
    renderInline: (props: RenderInlineProps, editor: Editor, next: () => any) => {
      const { attributes, children, node } = props;
      const tag = getTagForInline(node);
      return tag
              ? renderInlineAsTag(tag, node, { ...getRenderAttributesFromInline(node), ...attributes }, children)
              : next();
    }

  };
}
