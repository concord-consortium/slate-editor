import { createEditor as slateCreateEditor, Editor } from "slate";
import { withHistory } from "slate-history";
import { withReact } from "slate-react";
import {
  isBlockActive, isMarkActive, selectedElements, toggleBlock, toggleMark, toggleSuperSubscript
} from "./common/slate-utils";
import { withColorMark } from "./plugins/color-plugin";
import { withCoreBlocks } from "./plugins/core-blocks-plugin";
import { withCoreInlines } from "./plugins/core-inlines-plugin";
import { withCoreMarks } from "./plugins/core-marks-plugin";
import { withImages } from "./plugins/image-plugin";
import { withLinkInline } from "./plugins/link-plugin";
import { withListBlocks } from "./plugins/list-plugin";

interface ICreateEditorOptions {
  history?: boolean;
  onInitEditor?: (editor: Editor) => Editor;
}
export function createEditor(options?: ICreateEditorOptions) {
  const { history = true, onInitEditor } = options || {};
  let editor = withReact(slateCreateEditor());
  editor = history ? withHistory(editor) : editor;

  editor.plugins = {};

  editor.isMarkActive = isMarkActive.bind(editor, editor);
  editor.toggleMark = (format: string, value: any = true) => toggleMark(editor, format, value);
  editor.toggleSuperSubscript = toggleSuperSubscript.bind(editor, editor);
  editor.isElementActive = isBlockActive.bind(editor, editor);
  editor.toggleElement = toggleBlock.bind(editor, editor);

  editor.selectedElements = selectedElements.bind(editor, editor);

  editor.isElementEnabled = () => true;
  editor.configureElement = () => null;

  editor = withCoreMarks(editor);
  editor = withColorMark(editor);
  editor = withCoreBlocks(editor);
  editor = withListBlocks(editor);
  editor = withCoreInlines(editor);
  editor = withImages(editor);
  editor = withLinkInline(editor);

  // allow clients to attach their own plugins, etc.
  return onInitEditor?.(editor) ?? editor;
}
