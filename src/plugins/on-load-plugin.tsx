import { Editor, Plugin } from "slate-react";
import { Node } from "slate";

/*
 * Calls its onLoad() argument when resources load (e.g. <img> onLoad).
 */
export function OnLoadPlugin(onLoad?: (node: Node) => void): Plugin {
  return {
    commands: {
      onLoad: function (editor: Editor, node: Node) {
        onLoad?.(node);
        return editor;
      }
    }
  };
}
