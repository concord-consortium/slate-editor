import { createElement } from "react";
import { Editor } from "slate";
import { BooleanMarkType, CustomMarks, CustomText, MarkType } from "../common/custom-types";
import { EFormat } from "../common/slate-types";
import { registerMarkDeserializer } from "../serialization/html-serializer";
import { registerMarkRenderer } from "../slate-editor/leaf";

export const kTagToFormatMap: Record<string, string> = {
  code: EFormat.code,
  del: EFormat.deleted,
  em: EFormat.italic,
  ins: EFormat.inserted,
  mark: EFormat.marked,
  strong: EFormat.bold,
  sub: EFormat.subscript,
  sup: EFormat.superscript,
  u: EFormat.underlined
};

const kFormatToTagMap: Record<string, string> = {};

// build the kFormatToTagMap from the kTagToFormatMap
for (const tag in kTagToFormatMap) {
  const format = kTagToFormatMap[tag];
  kFormatToTagMap[format] = tag;
}

// add additional tags supported for import but not used for rendering
kTagToFormatMap["b"] = EFormat.bold;
kTagToFormatMap["i"] = EFormat.italic;
kTagToFormatMap["s"] = EFormat.deleted;
kTagToFormatMap["strike"] = EFormat.deleted;

let isRegistered = false;

export function registerCoreMarks() {
  if (isRegistered) return;

  // register components for rendering each mark
  for (const format in kFormatToTagMap) {
    registerMarkRenderer((children: any, leaf: CustomText) => {
      return leaf[format as MarkType]
              ? createElement(kFormatToTagMap[format], {}, children)
              : children;
    });
  }

  // register deserializers for each mark tag
  for (const tag in kTagToFormatMap) {
    registerMarkDeserializer(tag, {
      test: (el: HTMLElement) => el.nodeName.toLowerCase() === tag,
      deserialize: (el: HTMLElement, marks: CustomMarks) => marks[kTagToFormatMap[tag] as BooleanMarkType] = true
    });
  }

  isRegistered = true;
}

export function withCoreMarks(editor: Editor) {
  registerCoreMarks();
  return editor;
}
