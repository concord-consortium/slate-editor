// FIXME: font size plugin
// import { Editor, Plugin } from "slate-react";
// import { Value } from "slate";

// const kFontSizeMinimum = .2;
// const kFontSizeMaximum = 4;
// const kFontSizeDelta = .1;
// const kInitialSize = 1;

// export function getFontSize(value: Value) {
//   const fontSize = value.data?.get("fontSize");
//   return fontSize ? +fontSize : undefined;
// }

// function setFontSize(editor: Editor, fontSize: number) {
//   fontSize && editor.setData(editor.value.data.set("fontSize", "" + Math.round(10 * fontSize) / 10));
// }

// export function FontSizePlugin(): Plugin {
//   return {
//     queries: {
//       getFontSize: function(editor: Editor) {
//         return getFontSize(editor.value);
//       }
//     },
//     commands: {
//       increaseFontSize: function (editor: Editor) {
//         const currentFontSize = getFontSize(editor.value) || kInitialSize;
//         const newFontSize = Math.min(currentFontSize + kFontSizeDelta, kFontSizeMaximum);
//         setFontSize(editor, newFontSize);
//         return editor;
//       },
//       decreaseFontSize: function (editor: Editor) {
//         const currentFontSize = getFontSize(editor.value) || kInitialSize;
//         const newFontSize = Math.max(currentFontSize - kFontSizeDelta, kFontSizeMinimum);
//         setFontSize(editor, newFontSize);
//         return editor;
//       }
//     }
//   };
// }
