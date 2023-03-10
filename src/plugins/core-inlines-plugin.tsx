import { createElement } from "react";
import { Descendant, Editor } from "slate";
import { jsx } from "slate-hyperscript";
import { CustomElement, isLegacyInlineElement } from "../common/custom-types";
import { EFormat } from "../common/slate-types";
import { registerElementDeserializer } from "../serialization/html-serializer";
import { getElementAttrs } from "../serialization/html-utils";
import { eltRenderAttrs, registerElementComponent } from "../slate-editor/element";

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
  const tag = isLegacyInlineElement(elt) ? elt.tag || mappedTag : mappedTag;
  // default to <span> if no tag available
  return tag || "span";
}
