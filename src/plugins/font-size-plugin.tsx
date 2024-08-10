import { Editor } from "slate";
import IconFontDecrease from "../assets/icon-font-decrease";
import IconFontIncrease from "../assets/icon-font-increase";
import { EMetaFormat } from "../common/slate-types";
import { getPlatformTooltip, registerToolbarButtons } from "../common/toolbar-utils";

const kFontSizeMinimum = .2;
const kFontSizeMaximum = 4;
const kFontSizeDelta = .1;
const kInitialSize = 1;

function hasFontSize(editor: Editor) {
  return editor.data?.fontSize != null;
}

function getFontSize(editor: Editor) {
  return +(editor.data?.fontSize ?? kInitialSize);
}

function setFontSize(editor: Editor, fontSize: number) {
  if (!editor.data) {
    editor.data = {};
  }
  // store font size as string
  editor.data.fontSize = fontSize.toFixed(1);
}

function decreaseFontSize(editor: Editor) {
  const fontSize = getFontSize(editor);
  setFontSize(editor, Math.max(kFontSizeMinimum, fontSize - kFontSizeDelta));
  editor.onChange();
}

function increaseFontSize(editor: Editor) {
  const fontSize = getFontSize(editor);
  setFontSize(editor, Math.min(kFontSizeMaximum, fontSize + kFontSizeDelta));
  editor.onChange();
}

export function withFontSize(editor: Editor) {
  registerToolbarButtons(editor, [
    {
      format: EMetaFormat.fontIncrease,
      SvgIcon: IconFontIncrease,
      tooltip: getPlatformTooltip("increase font size"),
      isActive: () => false,
      onClick: () => increaseFontSize(editor)
    },
    {
      format: EMetaFormat.fontDecrease,
      SvgIcon: IconFontDecrease,
      tooltip: getPlatformTooltip("decrease font size"),
      isActive: () => false,
      onClick: () => decreaseFontSize(editor)
    },
  ]);

  const { globalStyle } = editor;
  editor.globalStyle = inStyle => {
    const style = globalStyle(inStyle);
    return hasFontSize(editor) ? { ...style, fontSize: `${getFontSize(editor)}em` } : style;
  };

  return editor;
}
