import { createEditor as slateCreateEditor, Editor } from "slate";
import { withHistory } from "slate-history";
import { withReact } from "slate-react";
import { withColorMark } from "./plugins/color-plugin";

interface ICreateEditorOptions {
  history?: boolean;
  onInitEditor?: (editor: Editor) => Editor;
}
export function createEditor(options?: ICreateEditorOptions) {
  const { history, onInitEditor } = options || {};
  const baseEditor = withReact(withColorMark(slateCreateEditor()));
  const editor = history ? withHistory(baseEditor) : baseEditor;
  // allow clients to attach their own plugins, etc.
  return onInitEditor ? onInitEditor(editor) : editor;
}
