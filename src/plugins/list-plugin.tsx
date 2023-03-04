import { createElement } from "react";
import { Descendant, Editor } from "slate";
import { jsx } from "slate-hyperscript";
import { EFormat } from "../common/slate-types";
import { registerElementDeserializer } from "../serialization/html-serializer";
import { getElementAttrs } from "../serialization/html-utils";
import { eltRenderAttrs, registerElementComponent } from "../slate-editor/element";

const kTagToFormatMap: Record<string, string> = {
        li: EFormat.listItem,
        ol: EFormat.numberedList,
        ul: EFormat.bulletedList
      };

const kFormatToTagMap: Record<string, string> = {};

// build the kFormatToTagMap from the kTagToFormatMap
for (const tag in kTagToFormatMap) {
  const format = kTagToFormatMap[tag];
  kFormatToTagMap[format] = tag;
}

let isRegistered = false;

export function registerListBlocks() {
  if (isRegistered) return;

  // register a component for each block format
  for (const format in kFormatToTagMap) {
    registerElementComponent(format, ({ element, attributes, children: children }) => {
      return createElement(kFormatToTagMap[format], { ...attributes, ...eltRenderAttrs(element) }, children);
    });
  }

  // register a deserializer for each block tag
  for (const tag in kTagToFormatMap) {
    registerElementDeserializer(tag, {
      deserialize: (el: HTMLElement, children: Descendant[]) => {
        return jsx("element", { type: kTagToFormatMap[tag], ...getElementAttrs(el) }, children);
      }
    });
  }

  isRegistered = true;
}

export function withListBlocks(editor: Editor) {
  registerListBlocks();
  return editor;
}
