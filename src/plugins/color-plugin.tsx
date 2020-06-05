import React, { ReactNode } from "react";
import { Mark } from "slate";
import { Rule } from "slate-html-serializer";
import { Editor, Plugin, RenderAttributes } from "slate-react";
import { EFormat } from "../common/slate-types";
import { getDataFromElement, getRenderAttributesFromNode, mergeClassStrings } from "../serialization/html-utils";

function getActiveColorMark(editor: Editor) {
  return editor.value.activeMarks.find(function(mark) { return mark?.type === EFormat.color; });
}

export function removeColorMarksFromSelection(editor: Editor) {
  editor.value.marks.toArray()
    .filter(mark => mark.type === EFormat.color)
    .forEach(mark => editor.removeMark(mark));
}

const kTextColorClass = "cc-text-color";

export function renderColorMark(mark: Mark, attributes: RenderAttributes, children: ReactNode, isSerializing = false) {
  const { data } = mark;
  const color = data.get("color");
  const textColor = { color };
  // color shouldn't change when text is selected
  const selectedColor = isSerializing ? undefined : { "--selected-color": color };
  const mergedStyle = { ...(attributes.style || {}), ...textColor, ...selectedColor };
  const classes = mergeClassStrings(kTextColorClass, attributes.className);
  return (<span className={classes} style={mergedStyle} {...attributes}>{children}</span>);
}

const kSpanTag = "span";

export const htmlRule: Rule = {
  deserialize: function(el, next) {
    if ((el.tagName.toLowerCase() === kSpanTag) && el.classList.contains(kTextColorClass)) {
      const data = getDataFromElement(el);
      return {
        object: "mark",
        type: EFormat.color,
        ...data,
        nodes: next(el.childNodes),
      };
    }
  },
  serialize: function(obj, children) {
    const { object, type } = obj;
    if ((object === "mark") && (type === EFormat.color)) {
      const mark: Mark = obj;
      return renderColorMark(mark, getRenderAttributesFromNode(mark), children, true);
    }
  }
};

export function ColorPlugin(): Plugin {
  return {
    queries: {
      getActiveColor: function(editor: Editor) {
        const mark = getActiveColorMark(editor);
        return mark && mark.data.get("color");
      },
      hasActiveColorMark: function(editor: Editor) {
        return !!getActiveColorMark(editor);
      }
    },
    commands: {
      setColorMark: function(editor: Editor, color: string) {
        const kBlackColor = "#000000";
        removeColorMarksFromSelection(editor);
        (color !== kBlackColor) && editor.addMark({ type: EFormat.color, data: { color } });
        return editor;
      }
    }
  };
}
