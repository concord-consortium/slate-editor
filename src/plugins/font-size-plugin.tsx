import { Editor, Plugin } from "slate-react";
import { Data } from "slate";

const kFontSizeMinimum = .2;
const kFontSizeMaximum = 4;
const kFontSizeDelta = .1;
export const kInitialSize = 1;

export const fontSizePlugin: Plugin = {
  commands: {
    increaseFontSize: function (editor: Editor) {
      const editorData: Data = editor.value.data;
      const currentFontSize = editorData.get("fontSize") || kInitialSize;
      const newFontSize = Math.min(currentFontSize + kFontSizeDelta, kFontSizeMaximum);
      editor.setData(editorData.set("fontSize", newFontSize));
      return editor;
    },
    decreaseFontSize: function (editor: Editor) {
      const editorData: Data = editor.value.data;
      const currentFontSize = editorData.get("fontSize") || kInitialSize;
      const newFontSize = Math.max(currentFontSize - kFontSizeDelta, kFontSizeMinimum);
      editor.setData(editorData.set("fontSize", newFontSize));
      return editor;
    }    
  },
};
