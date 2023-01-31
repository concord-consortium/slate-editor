import React from "react";
import { Editor } from "slate";
// import { Mark } from "slate";
// import { Editor, RenderAttributes, RenderMarkProps } from "slate-react";
import { CustomMarks, CustomRenderLeafProps, CustomText } from "../common/custom-types";
import { useSerializing } from "../hooks/use-serializing";
import { EFormat } from "../common/slate-types";
// import { getDataFromElement, getRenderAttributesFromNode, mergeClassStrings } from "../serialization/html-utils";
import { registerMarkRenderer } from "../slate-editor/leaf";
import { registerMarkDeserializer } from "../serialization/html-serializer";
import { toHexIfColor } from "../serialization/html-utils";
// import { HtmlSerializablePlugin } from "./html-serializable-plugin";

const kTextColorClass = "ccrte-text-color";

// function getActiveColorMark(editor: Editor) {
//   return (editor.marks as CustomText | null)?.[EFormat.color];
// }

// export function renderColorMark(mark: Mark, attributes: RenderAttributes, children: ReactNode, isSerializing = false) {
//   const { data } = mark;
//   const color = data.get("color");
//   const textColor = { color };
//   // color shouldn't change when text is selected
//   const selectedColor = isSerializing ? undefined : { "--selected-color": color };
//   const mergedStyle = { ...(attributes.style || {}), ...textColor, ...selectedColor };
//   const classes = mergeClassStrings(kTextColorClass, attributes.className);
//   return (<span className={classes} style={mergedStyle} {...attributes}>{children}</span>);
// }

// const kSpanTag = "span";

// function getColorMarkToRender(props: RenderMarkProps): Mark | undefined {
//   return props.marks.find(m => !!(m && (m.type === EFormat.color)));
// }

// By default, marks are rendered in the order in which they're stored in the model,
// which is the order in which they're added by the user. In some cases, however,
// there are ordering dependencies in the rendering of the marks, notably that a
// text color mark must wrap a strikethrough mark for the strikethrough to be
// rendered in the correct color. Therefore, we play a bit of sleight-of-hand by
// rendering the mark that should be rendered at the appropriate mark render index
// rather than rendering the mark that slate actually asked us to render.
// function getMarkToRender(props: RenderMarkProps): Mark | undefined {
//   // find index of mark we were asked to render
//   const requestedMarkIndex = getRenderIndexOfMark(props);
//   // color mark is always rendered last
//   return requestedMarkIndex === props.marks.size - 1
//           ? getColorMarkToRender(props)
//           : undefined;
// }

export const ColorComponent = ({ children, leaf }: CustomRenderLeafProps) => {
  const isSerializing = useSerializing();
  const { color } = leaf;
  const baseStyle = { color };
  // color shouldn't change when text is selected
  const selectedStyle = isSerializing ? undefined : { "--selected-color": color };
  return <span className={kTextColorClass} style={{ ...baseStyle, ...selectedStyle }}>{children}</span>;
};

let isRegistered = false;

// should be registered after other marks so color wraps the others
export function registerColorMark() {
  if (isRegistered) return;

  registerMarkRenderer((children: any, leaf: CustomText) => {
    return leaf[EFormat.color]
            ? <ColorComponent leaf={leaf}>{children}</ColorComponent>
            : children;
  });

  registerMarkDeserializer("span", {
    test: (el: HTMLElement) => {
      // console.log("testing for color node:", "tag:", el.nodeName, "classes:", el.className, "style:", JSON.stringify(el.style));
      return el.nodeName.toLowerCase() === "span" && el.classList.contains(kTextColorClass);
    },
    deserialize: (el: HTMLElement, marks: CustomMarks) => marks.color = toHexIfColor(el.style.color)
  });

  isRegistered = true;
}

export function withColorMark(editor: Editor) {
  registerColorMark();
  return editor;
}

  //   deserialize: function(el, next) {
  //     if ((el.tagName.toLowerCase() === kSpanTag) && el.classList.contains(kTextColorClass)) {
  //       const data = getDataFromElement(el);
  //       return {
  //         object: "mark",
  //         type: EFormat.color,
  //         ...data,
  //         nodes: next(el.childNodes),
  //       };
  //     }
  //   },
  //   serialize: function(obj, children) {
  //     const { object, type } = obj;
  //     if ((object === "mark") && (type === EFormat.color)) {
  //       const mark: Mark = obj;
  //       return renderColorMark(mark, getRenderAttributesFromNode(mark, ["color"]), children, true);
  //     }
  //   },
