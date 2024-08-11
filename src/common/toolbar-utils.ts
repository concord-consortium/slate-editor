import { Editor } from "slate";
import { EFormat, EMetaFormat } from "./slate-types";
import { IDialogController } from "../modal-dialog/dialog-types";
import { IButtonBaseProps, IButtonColors } from "../editor-toolbar/toolbar-button";

export function getPlatformTooltip(str: string) {
  const IS_MAC = typeof window != 'undefined' &&
                  /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);
  const modKey = IS_MAC ? "cmd-" : "ctrl-";
  return str.replace("mod-", modKey);
}

export type ButtonSpecColorFn = (colors: IButtonColors) => IButtonColors;
export interface IButtonSpec extends Omit<IButtonBaseProps, "colors" | "selectedColors"> {
  iconSize?: number;
  colors?: ButtonSpecColorFn;
  selectedColors?: ButtonSpecColorFn;
}

type ButtonSpecKey = NonNullable<EFormat | EMetaFormat | string>;
export type EFormatOrButtonSpec = NonNullable<ButtonSpecKey | IButtonSpec>;
type ButtonSpecMap = Map<ButtonSpecKey, IButtonSpec>;

// use WeakMap to associate toolbar buttons with editor instances
const gButtonRegistry = new WeakMap<Editor, ButtonSpecMap>();

export function getToolbarButton(editor: Editor, format: ButtonSpecKey) {
  return gButtonRegistry.get(editor)?.get(format);
}

export function registerToolbarButtons(editor: Editor, buttons: IButtonSpec[]) {
  let editorButtons = gButtonRegistry.get(editor);
  if (!editorButtons) {
    editorButtons = new Map<ButtonSpecKey, IButtonSpec>();
    gButtonRegistry.set(editor, editorButtons);
  }
  for (const button of buttons) {
    if (button.format) {
      editorButtons.set(button.format, button);
    }
  }
}

// use WeakMap to associate toolbar buttons with editor instances
const gDialogControllers = new WeakMap<Editor, IDialogController>();

export function getDialogController(editor: Editor) {
  return gDialogControllers.get(editor);
}

export function setDialogController(editor: Editor, controller: IDialogController) {
  gDialogControllers.set(editor, controller);
}
