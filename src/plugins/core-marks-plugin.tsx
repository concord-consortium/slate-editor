import React, { ReactNode } from "react";
import { Mark } from "slate";
import { RenderAttributes, RenderMarkProps } from "slate-react";
import { getRenderIndexOfMark } from "../slate-editor/slate-utils";
import { EFormat } from "../common/slate-types";
import { getRenderAttributesFromNode, getDataFromElement } from "../serialization/html-utils";
import { HtmlSerializablePlugin } from "./html-serializable-plugin";

function renderMarkAsTag(tag: string, mark: Mark, attributes: RenderAttributes,
                          children: ReactNode, isSerializing = false) {
  return React.createElement(tag, attributes, children);
}

const kTagToFormatMap: Record<string, string> = {
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

function getTagForMark(mark: Mark) {
  const { type, data } = mark;
  const formatValue = data.get(type);
  return typeof formatValue === "string"
          ? formatValue
          : kFormatToTagMap[type];
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
          ...getDataFromElement(el, { [format]: tag }),
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
