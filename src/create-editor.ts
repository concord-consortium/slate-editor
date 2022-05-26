import { createEditor as slateCreateEditor, Editor } from "slate";
import { withHistory } from "slate-history";
import { withReact } from "slate-react";
import { isBlockActive, isMarkActive, selectedElements, toggleBlock, toggleMark } from "./common/slate-utils";
import { withColorMark } from "./plugins/color-plugin";
import { withEmitter } from "./plugins/emitter-plugin";
import { withImages } from "./plugins/image-plugin";
import { withLinkInlines } from "./plugins/link-plugin";

interface ICreateEditorOptions {
  color?: boolean;
  history?: boolean;
  images?: boolean;
  links?: boolean;
  onInitEditor?: (editor: Editor) => Editor;
}
export function createEditor(options?: ICreateEditorOptions) {
  const { color = true, history = true, images = true, links = true, onInitEditor } = options || {};
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

  // allow clients to attach their own plugins, etc.
  return onInitEditor ? onInitEditor(editor) : editor;
}
