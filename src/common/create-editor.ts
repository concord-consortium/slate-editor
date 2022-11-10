import { createEditor as slateCreateEditor, Editor } from "slate";
import { withHistory } from "slate-history";
import { withReact } from "slate-react";
import { withEmitter } from "../plugins/emitter-plugin";
import { isBlockActive, isMarkActive, selectedElements, toggleBlock, toggleMark } from "../slate-editor/slate-utils";
import { withLinkInlines } from "../plugins/link-plugin";
import { withColorMark } from "../plugins/color-plugin";
import { withImages } from "../plugins/image-plugin";
import { withVariables } from "../plugin-examples/variable-plugin";

interface ICreateEditorOptions {
  color?: boolean;
  history?: boolean;
  images?: boolean;
  links?: boolean;
  variables? : boolean;
  onInitEditor?: (editor: Editor) => Editor;
}
export function createEditor(options?: ICreateEditorOptions) {
  const { color = true, history = true, images = true, links = true, variables=true, onInitEditor } = options || {};
  let editor = withReact(slateCreateEditor());
  editor = history ? withHistory(editor) : editor;

  editor.isMarkActive = isMarkActive.bind(editor, editor);
  editor.toggleMark = toggleMark.bind(editor, editor);
  editor.isElementActive = isBlockActive.bind(editor, editor);
  editor.toggleElement = toggleBlock.bind(editor, editor);

  editor.selectedElements = selectedElements.bind(editor, editor);

  editor.isElementEnabled = () => true;
  editor.configureElement = () => null;

  editor = withEmitter(editor);

  editor = color ? withColorMark(editor) : editor;
  editor = images ? withImages(editor) : editor;
  editor = links ? withLinkInlines(editor) : editor;
  editor = variables ? withVariables(editor): editor;

  // allow clients to attach their own plugins, etc.
  return onInitEditor ? onInitEditor(editor) : editor;
}