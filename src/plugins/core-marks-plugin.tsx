import { createElement } from "react";
import { Editor } from "slate";
import { BooleanMarkType, CustomMarks, CustomText, MarkType } from "../common/custom-types";
import { EFormat } from "../common/slate-types";
import { registerMarkDeserializer } from "../serialization/html-serializer";
import { registerMarkRenderer } from "../slate-editor/leaf";

/*
import React, { ReactNode } from "react";
import { Mark } from "slate";
import { RenderAttributes, RenderMarkProps } from "slate-react";
import { getRenderIndexOfMark } from "../slate-editor/slate-utils";
import { EFormat } from "../common/slate-types";
import { getRenderAttributesFromNode } from "../serialization/html-utils";
import { HtmlSerializablePlugin } from "./html-serializable-plugin";

function renderMarkAsTag(tag: string, mark: Mark, attributes: RenderAttributes,
                          children: ReactNode, isSerializing = false) {
  return React.createElement(tag, attributes, children);
}
*/

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

/*
function getTagForMark(mark: Mark) {
  // auto-convert mark tags for consistency with TinyMCE editor
  return kFormatToTagMap[mark.type];

  // const { type, data } = mark;
  // const formatValue = data.get(type);
  // return typeof formatValue === "string"
  //         ? formatValue
  //         : kFormatToTagMap[type];
}

function getHandledMarkAtIndex(props: RenderMarkProps, index: number): Mark | undefined {
  const { marks } = props;

  // return the mark that would be at that index if only
  // marks handled by this plugin were present.
  let handledMarkIndex = 0;
  return marks.find(m => {
    const isHandledMark = !!(m && kFormatToTagMap[m.type]);
    if (isHandledMark) {
      if (handledMarkIndex === index) return true;
      ++handledMarkIndex;
    }
    return false;
  });
}

// By default, marks are rendered in the order in which they're stored in the model,
// which is the order in which they're added by the user. In some cases, however,
// there are ordering dependencies in the rendering of the marks, notably that a
// text color mark must wrap a strikethrough mark for the strikethrough to be
// rendered in the correct color. Therefore, we play a bit of sleight-of-hand by
// rendering the mark that should be rendered at the appropriate mark render index
// rather than rendering the mark that slate actually asked us to render.
function getMarkToRender(props: RenderMarkProps): Mark | undefined {

  // find index of mark we were asked to render
  const requestedMarkIndex = getRenderIndexOfMark(props);

  // render the mark that would be at that index if unhandled marks were removed
  return getHandledMarkAtIndex(props, requestedMarkIndex);
}

export function CoreMarksPlugin(): HtmlSerializablePlugin {
  return {

    deserialize: function(el, next) {
      const tag = el.tagName.toLowerCase();
      const format = kTagToFormatMap[tag];
      if (format) {
        return {
          object: "mark",
          type: format,
          // Adding data attributes in this way allows us to (1) preserve the original tag (e.g. <b> vs. <strong>)
          // and (2) preserve any attributes that may have been associated with the tag. Unfortunately, it also
          // wreaks havoc with Slate's mark management because marks are compared by value, so two bold marks
          // with different tags/attributes no longer compare as equal resulting in toggleMark() not working as
          // expected, neighboring bold marks not being combined properly, etc. Given that of the original
          // benefits, we are not taking advantage of (1) because we are following TinyMCE's example and simply
          // converting legacy tags to their current equivalents and there are no known examples of attributes
          // being applied to mark tags (2), we simply disable this functionality for now. Leaving it commented
          // out for now in case we encounter an argument for going back.
          // ...getDataFromElement(el, { [format]: tag }),
          nodes: next(el.childNodes),
        };
      }
    },
    serialize: function(obj, children) {
      const { object, type: format } = obj;
      if (kFormatToTagMap[format] && (object === "mark")) {
        const mark: Mark = obj;
        const tag = getTagForMark(mark);
        const attributes = getRenderAttributesFromNode(mark, [format]);
        return renderMarkAsTag(tag, mark, attributes, children, true);
      }
    },

    renderMark: (props, editor, next) => {
      const { attributes, children } = props;
      const mark = getMarkToRender(props);
      // use imported tag if present
      const tag = mark && getTagForMark(mark);
      return mark && tag
              ? renderMarkAsTag(tag, mark, { ...getRenderAttributesFromNode(mark), ...attributes }, children)
              : next();
    }

  };
}
*/
