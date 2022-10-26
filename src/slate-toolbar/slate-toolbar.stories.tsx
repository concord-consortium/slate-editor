import React, { useCallback, useMemo } from "react";
import { Slate, withReact } from "slate-react";
import { createEditor } from "../common/create-editor";
import { textToSlate } from "../common/slate-types";
import { IButtonSpec } from "../editor-toolbar/editor-toolbar";
import { SlateEditor } from "../slate-editor/slate-editor";
import { SlateToolbar, ToolbarTransform } from "./slate-toolbar";

export default {
  title: "SlateToolbar"
};
export const Horizontal = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  return (
    <Slate editor={editor} value={[]}>
      <SlateToolbar/>
    </Slate>
  );
};

export const Vertical = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  return (
  <Slate editor={editor} value={[]}>
      <SlateToolbar orientation="vertical"/>
    </Slate>
  );
};

// export const Colored = () => (
//   <SlateToolbar changeCount={0}
//     orientation="vertical"
//     colors={{ buttonColors: { background: "#177991", fill: "#ffffff" } }}
//     />
// );

// export const TwoColumns = () => (
//   <SlateToolbar changeCount={0}
//     orientation="vertical"
//     colors={{ buttonColors: { background: "#177991", fill: "#ffffff" } }}
//     buttonsPerRow={9}
//     />
// );

// export const ThreeColumns = () => (
//   <SlateToolbar changeCount={0}
//     orientation="vertical"
//     colors={{ buttonColors: { background: "#177991", fill: "#ffffff" } }}
//     buttonsPerRow={6}
//     />
// );

// const order = [
//         "fontDecrease", "bold", "italic", "underlined", "deleted", "code", "superscript", "subscript", "color",
//         "fontIncrease", "heading1", "heading2", "heading3", "block-quote", "bulleted-list", "ordered-list", "image", "link"
//       ];

// export const Ordered = () => {
//   const transform = useCallback<ToolbarTransform>(buttons => {
//     return order
//             .map(format => buttons.find(b => b.format === format))
//             .filter(b => !!b) as IButtonSpec[];
//   }, []);
//   return (
//     <SlateToolbar changeCount={0}
//       orientation="vertical"
//       colors={{ buttonColors: { background: "#177991", fill: "#ffffff" } }}
//       buttonsPerRow={9}
//       transform={transform}
//       />
//   );
// };

// export const OrderedHinted = () => {
//   const transform = useCallback<ToolbarTransform>(buttons => {
//     return order
//             // show subset of tools
//             .filter((f, i) => (i + 1) % 4 !== 0)
//             .reverse()
//             .map(format => buttons.find(b => b.format === format))
//             // override tooltips
//             .map(b => {
//               const { tooltip, ...others } = b || {};
//               return { ...others, tooltip: tooltip ? `hint: ${tooltip}` : tooltip };
//             })
//             .filter(b => !!b) as IButtonSpec[];
//   }, []);
//   return (
//     <SlateToolbar changeCount={0}
//       orientation="vertical"
//       colors={{ buttonColors: { background: "#177991", fill: "#ffffff" } }}
//       buttonsPerRow={7}
//       transform={transform}
//       />
//   );
// };
