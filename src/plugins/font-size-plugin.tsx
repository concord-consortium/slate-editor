import { Editor, Plugin } from "slate-react";
import { Data } from "slate";

const kFontSizeMinimum = .2;
const kFontSizeMaximum = 4;
const kFontSizeDelta = .1;
export const kInitialSize = 1;

export const fontSizePlugin: Plugin = {
  commands: {
    adjustFontSize: function (editor: Editor, increase: boolean) {
      const editorData: Data = editor.value.data;
      const currentFontSize = editorData.has("fontSize") ? editorData.get("fontSize") : kInitialSize;
      const newFontSize = increase 
                          ? Math.min(currentFontSize + kFontSizeDelta, kFontSizeMaximum) 
                          : Math.max(currentFontSize - kFontSizeDelta, kFontSizeMinimum);
      editor.setData(editorData.set("fontSize", newFontSize));
      return editor;
    }
  },
};
