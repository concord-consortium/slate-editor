import EventEmitter from "eventemitter3";
import { CustomEditor } from "../common/slate-types";

export function withEmitter(editor: CustomEditor) {
  const emitter = new EventEmitter();

  editor.emitEvent = (event: string, ...args: any[]) => {
    console.log('emitting event!');
    emitter.emit(event, ...args);
  };

  editor.onEvent = (event: string, handler: (...args: any[]) => void) => {
    emitter.on(event, handler);
  };

  editor.offEvent = (event: string, handler: (...args: any[]) => void) => {
    emitter.off(event, handler);
  };

  return editor;
}