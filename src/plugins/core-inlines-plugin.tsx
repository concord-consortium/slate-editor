import { createElement } from "react";
import { Descendant, Editor } from "slate";
import { jsx } from "slate-hyperscript";
import { CustomElement, isLegacyInlineElement } from "../common/custom-types";
import { EFormat } from "../common/slate-types";
import { registerElementDeserializer } from "../serialization/html-serializer";
import { getElementAttrs } from "../serialization/html-utils";
import { eltRenderAttrs, registerElementComponent } from "../slate-editor/element";
/*
import React, { ReactNode } from "react";
import _size from "lodash/size";
import { Inline, Node } from "slate";
import { Editor, RenderAttributes, RenderInlineProps } from "slate-react";
import { getRenderAttributesFromNode, getDataFromElement } from "../serialization/html-utils";
import { EFormat } from "../common/slate-types";
import { HtmlSerializablePlugin } from "./html-serializable-plugin";
*/

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
  "audio", "iframe", "picture", "video"
];
export const kLegacyContentInlineTags = [
  "abbr", "acronym", "big", "cite", "dfn", "label", "q", "samp", "small", /* "textarea" */
];
export const kLegacyConvertedInlineTags = ["font"];
export const kLegacyNonEmptyInlineTags = [...kLegacyContentInlineTags, ...kLegacyVoidNonEmptyInlineTags];
export const kLegacyVoidInlineTags = [...kLegacyEmptyInlineTags, ...kLegacyVoidNonEmptyInlineTags];
export const kLegacyInlineTags = [...kLegacyConvertedInlineTags, ...kLegacyContentInlineTags, ...kLegacyVoidInlineTags];

// other inline tags handled as generic inlines
kLegacyInlineTags.forEach(tag => kTagToFormatMap[tag] = EFormat.inline);

export function isLegacyVoidInlineElement(element: CustomElement) {
  return isLegacyInlineElement(element) && kLegacyVoidInlineTags.includes(element.tag);
}

let isRegistered = false;

export function registerCoreInlines() {
  if (isRegistered) return;

  for (const format in kFormatToTagMap) {
    registerElementComponent(format, ({ attributes, children: _children, element }) => {
      const tag = getTagForInline(element);
      const children = kLegacyEmptyInlineTags.includes(tag) ? undefined : _children;
      return createElement(tag, { ...attributes, ...eltRenderAttrs(element) }, children);
    });
  }

  registerElementDeserializer("span", {
    deserialize: (el: HTMLElement, children: Descendant[]) => {
      return jsx("element", { type: EFormat.inline, ...getElementAttrs(el) }, children);
    }
  });
  for (const tag of kLegacyInlineTags) {
    registerElementDeserializer(tag, {
      deserialize: (el: HTMLElement, _children: Descendant[]) => {
        const legacyTag = kLegacyInlineTags.includes(tag) ? { tag } : undefined;
        const children = kLegacyEmptyInlineTags.includes(tag) ? undefined : _children;
        return jsx("element", { type: kTagToFormatMap[tag], ...legacyTag, ...getElementAttrs(el) }, children);
      }
    });
  }

  isRegistered = true;
}

export function withCoreInlines(editor: Editor) {
  const { isInline, isVoid } = editor;
  registerCoreInlines();
  editor.isInline = (element: CustomElement) => !!kFormatToTagMap[element.type] || isInline(element);
  editor.isVoid = (element: CustomElement) => isLegacyVoidInlineElement(element) || isVoid(element);
  return editor;
}

function getTagForInline(elt: CustomElement) {
  const { type: format } = elt;
  const mappedTag = kFormatToTagMap[format];
  // use the imported tag for generic <span> elements
  return isLegacyInlineElement(elt) ? elt.tag || mappedTag : mappedTag;
}

/*
function isCoreInline(node: Node) {
  return Inline.isInline(node) && !!kFormatToTagMap[node.type];
}

export function getTagForInline(node: Node): string | undefined {
  if (!Inline.isInline(node) || !isCoreInline(node)) return undefined;
  const { type: format, data } = node;
  return data.get("tag") || kFormatToTagMap[format];
}

export function getRenderTagForInline(node: Node): string | undefined {
  if (!Inline.isInline(node) || !isCoreInline(node)) return undefined;
  const { type: format, data } = node;
  const tag = data.get("tag");
  // <font> tags are converted to styled <span> tags
  return tag && (tag !== "font")
          ? tag
          : kFormatToTagMap[format];
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

// convert <font> tag to style attributes for a <span> tag
// cf. https://developer.mozilla.org/en-US/docs/Web/HTML/Element/font
function getRenderAttributesFromFontInline(inline: Inline): RenderAttributes {
  const { data } = inline;
  const fontStyle: React.CSSProperties = {};
  const color = data.get("color");
  if (color) fontStyle.color = color;
  const face = data.get("face");
  if (face) fontStyle.fontFamily = face;
  const size: string | undefined = data.get("size");
  if (size) {
    let index = 0;
    if (/^\d$/.test(size))        index = +size;
    else if (/^-\d$/.test(size))  index = 3 - +size[1];
    else if (/^\+\d$/.test(size)) index = 3 + +size[1];
    if (index) {
      index = Math.max(1, Math.min(7, index)) - 1;
      fontStyle.fontSize = ["xx-small", "small", "medium", "large", "x-large", "xx-large", "xxx-large"][index];
    }
  }
  const attributes = getRenderAttributesFromNode(inline, ["tag", "color", "face", "size"]);
  const style = { ...fontStyle, ...(attributes?.style || {})};
  if (_size(style)) {
    attributes.style = style;
  }
  return attributes;
}

function getRenderAttributesFromInline(inline: Inline): RenderAttributes {
  if (getTagForInline(inline) === "font") {
    return getRenderAttributesFromFontInline(inline);
  }
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
      const tag = getRenderTagForInline(obj);
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
      const tag = getRenderTagForInline(node);
      return tag
              ? renderInlineAsTag(tag, node, { ...getRenderAttributesFromInline(node), ...attributes }, children)
              : next();
    }

  };
}
*/
