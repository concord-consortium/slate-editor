import { Plugin } from "slate-react";
import isHotkey from "is-hotkey";

export interface IOptions {
  undoHotkey?: string;
  redoHotkey?: string;
}

// if we're enabling editor history, enable keyboard shortcuts
export function EditorHistory(options?: IOptions): Plugin {
  const isUndoHotkey = isHotkey(options?.undoHotkey || "mod+z");
  const isRedoHotkey = isHotkey(options?.redoHotkey || "mod+shift+z");
  return {
    onKeyDown(event, editor, next) {
      if (isUndoHotkey(event as any)) editor.undo();
      else if (isRedoHotkey(event as any)) editor.redo();
      else return next();
    }
  };
}

// disable history by preventing editor save operations
export function NoEditorHistory(): Plugin {
  return {
    onCommand(command, editor, next) {
      // intercept save commands so undo/redo history isn't kept
      return (command.type !== "save") && next();
    }
  };
}
