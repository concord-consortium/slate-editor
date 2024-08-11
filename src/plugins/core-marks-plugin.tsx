import { createElement } from "react";
import { Editor } from "slate";
import IconBold from "../assets/icon-bold";
import IconCode from "../assets/icon-code";
import IconItalic from "../assets/icon-italic";
import IconStrikethrough from "../assets/icon-strikethrough";
import IconSubscript from "../assets/icon-subscript";
import IconSuperscript from "../assets/icon-superscript";
import IconUnderline from "../assets/icon-underline";
import { BooleanMarkType, CustomMarks, CustomText, MarkType } from "../common/custom-types";
import { EFormat } from "../common/slate-types";
import { isMarkActive, toggleMark, toggleSuperSubscript } from "../common/slate-utils";
import { getPlatformTooltip, registerToolbarButtons } from "../common/toolbar-utils";
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

  // register toolbar buttons for each mark
  registerToolbarButtons(editor, [
    {
      format: EFormat.bold,
      SvgIcon: IconBold,
      tooltip: getPlatformTooltip("bold (mod-b)"),
      isActive: () => isMarkActive(editor, EFormat.bold),
      onClick: () => toggleMark(editor, EFormat.bold)
    },
    {
      format: EFormat.italic,
      SvgIcon: IconItalic,
      tooltip: getPlatformTooltip("italic (mod-i)"),
      isActive: () => isMarkActive(editor, EFormat.italic),
      onClick: () => toggleMark(editor, EFormat.italic)
    },
    {
      format: EFormat.underlined,
      SvgIcon: IconUnderline,
      tooltip: getPlatformTooltip("underline (mod-u)"),
      isActive: () => isMarkActive(editor, EFormat.underlined),
      onClick: () => toggleMark(editor, EFormat.underlined)
    },
    {
      format: EFormat.deleted,
      SvgIcon: IconStrikethrough,
      tooltip: getPlatformTooltip("strikethrough"),
      isActive: () => isMarkActive(editor, EFormat.deleted),
      onClick: () => toggleMark(editor, EFormat.deleted)
    },
    {
      format: EFormat.code,
      SvgIcon: IconCode,
      tooltip: getPlatformTooltip("code (mod-\\)"),
      isActive: () => isMarkActive(editor, EFormat.code),
      onClick: () => toggleMark(editor, EFormat.code)
    },
    {
      format: EFormat.superscript,
      SvgIcon: IconSuperscript,
      tooltip: getPlatformTooltip("superscript"),
      isActive: () => isMarkActive(editor, EFormat.superscript),
      onClick: () => toggleSuperSubscript(editor, EFormat.superscript)
    },
    {
      format: EFormat.subscript,
      SvgIcon: IconSubscript,
      tooltip: getPlatformTooltip("subscript"),
      isActive: () => isMarkActive(editor, EFormat.subscript),
      onClick: () => toggleSuperSubscript(editor, EFormat.subscript)
    }
  ]);

  return editor;
}
