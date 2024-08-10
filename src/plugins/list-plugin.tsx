import { createElement } from "react";
import { Descendant, Editor } from "slate";
import { jsx } from "slate-hyperscript";
import IconBulletedList from "../assets/icon-list-bulleted";
import IconNumberedList from "../assets/icon-list-numbered";
import { EFormat } from "../common/slate-types";
import { isBlockActive, toggleBlock } from "../common/slate-utils";
import { getPlatformTooltip, registerToolbarButtons } from "../common/toolbar-utils";
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

  registerToolbarButtons(editor, [
    {
      format: EFormat.numberedList,
      SvgIcon: IconNumberedList,
      tooltip: getPlatformTooltip("numbered list"),
      isActive: () => !!editor && isBlockActive(editor, EFormat.numberedList),
      onClick: () => toggleBlock(editor, EFormat.numberedList)
    },
    {
      format: EFormat.bulletedList,
      SvgIcon: IconBulletedList,
      tooltip: getPlatformTooltip("bulleted list"),
      isActive: () => !!editor && isBlockActive(editor, EFormat.bulletedList),
      onClick: () => toggleBlock(editor, EFormat.bulletedList)
    }
  ]);

  return editor;
}
