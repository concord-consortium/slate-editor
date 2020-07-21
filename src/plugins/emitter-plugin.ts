import { Editor, Plugin } from "slate-react";
import EventEmitter from "eventemitter3";

const emitter = new EventEmitter();

export function EmitterPlugin(): Plugin {
  return {
    queries: {
      emitter: function(editor: Editor) {
        return emitter;
      }
    },
    commands: {
      emit: function (editor: Editor, event: string, ...args: any) {
        emitter.emit(event, ...args);
        return editor;
      }
    }
  };
}
