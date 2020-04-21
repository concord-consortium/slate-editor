import { Editor } from "slate-react";
import { EFormat } from "../common/slate-types";
import { findActiveMark, handleToggleMark, hasActiveMark } from "../slate-editor/slate-utils";

export function hasActiveTextColorMark(editor?: Editor) {
  return editor ? hasActiveMark(editor.value, EFormat.textColor) : false;
}

export function handleTextColor(format: EFormat, color: string, editor?: Editor) {
  if (!editor) return;
  const markProps = { type: format, data: { color } };
  // remove any existing color mark
  const colorMark = findActiveMark(editor.value, format);
  if (colorMark) {
    editor.removeMark(colorMark);
  }
  // add the new color mark
  // colorMark && (editor as any).setOperationFlag("merge", true);
  handleToggleMark(markProps, editor);
}
