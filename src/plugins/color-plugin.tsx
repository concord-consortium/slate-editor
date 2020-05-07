import { Editor, Plugin } from "slate-react";
import { EFormat } from "../common/slate-types";

function getActiveColorMark(editor: Editor) {
  return editor.value.activeMarks.find(function(mark) { return mark?.type === EFormat.color; });
}

export function removeColorMarksFromSelection(editor: Editor) {
  editor.value.marks.toArray()
    .filter(mark => mark.type === EFormat.color)
    .forEach(mark => editor.removeMark(mark));
}

export const colorPlugin: Plugin = {
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
      removeColorMarksFromSelection(editor);
      editor.addMark({ type: EFormat.color, data: { color } });
      return editor;
    }
  }
};
