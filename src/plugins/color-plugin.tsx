import React, { useContext } from "react";
import { Editor } from "slate";
// import { Mark } from "slate";
// import { Editor, RenderAttributes, RenderMarkProps } from "slate-react";
import { CustomRenderLeafProps, CustomText } from "../common/custom-types";
import { IsSerializingContext } from "../common/is-serializing-context";
import { EFormat } from "../common/slate-types";
// import { getDataFromElement, getRenderAttributesFromNode, mergeClassStrings } from "../serialization/html-utils";
import { registerMark } from "../slate-editor/leaf";
// import { getRenderIndexOfMark } from "../slate-editor/slate-utils";
// import { HtmlSerializablePlugin } from "./html-serializable-plugin";

const kTextColorClass = "cc-text-color";

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

export const ColorLeaf = ({ children, leaf }: CustomRenderLeafProps) => {
  const isSerializing = useContext(IsSerializingContext);
  const { color } = leaf as CustomText;
  const baseStyle = { color };
  // color shouldn't change when text is selected
  const selectedStyle = isSerializing ? undefined : { "--selected-color": color };
  return <span className={kTextColorClass} style={{ ...baseStyle, ...selectedStyle }}>{children}</span>;
};

export function withColorMark(editor: Editor) {

  registerMark(EFormat.color, (children: any, leaf: CustomText) => <ColorLeaf leaf={leaf}>{children}</ColorLeaf>);

  return editor;

  // return {
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

  //   queries: {
  //     getActiveColor: function(editor: Editor) {
  //       const mark = getActiveColorMark(editor);
  //       return mark && mark.data.get("color");
  //     },
  //     hasActiveColorMark: function(editor: Editor) {
  //       return !!getActiveColorMark(editor);
  //     }
  //   },
  //   commands: {
  //     setColorMark: function(editor: Editor, color: string) {
  //       const kBlackColor = "#000000";
  //       removeColorMarksFromSelection(editor);
  //       (color !== kBlackColor) && editor.addMark({ type: EFormat.color, data: { color } });
  //       return editor;
  //     }
  //   },

  //   renderMark: (props, editor, next) => {
  //     const { attributes, children } = props;
  //     const mark = getMarkToRender(props);
  //     return mark
  //             ? renderColorMark(mark, { ...getRenderAttributesFromNode(mark), ...attributes }, children)
  //             : next();
  //   }
  // };
}
