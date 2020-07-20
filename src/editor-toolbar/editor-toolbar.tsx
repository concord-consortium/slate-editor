import React, { useCallback, useRef } from "react";
import { IBaseProps, IButtonColors, OnDidInvokeToolFn, ToolbarButton } from "./toolbar-button";
import { Editor } from "slate-react";
import { SelectionJSON } from "slate";

export interface IButtonSpec extends IBaseProps {
  iconSize?: number;
}

export interface IToolbarColors {
  buttonColors?: IButtonColors;
  selectedColors?: IButtonColors;
  themeColor?: string;
}

export interface IProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
  padding?: number;
  colors?: IToolbarColors;
  buttonsPerRow?: number;
  iconSize?: number;
  buttonSize?: number;
  buttons: IButtonSpec[];
  editor?: Editor;
  show?: boolean;
  onDidInvokeTool?: OnDidInvokeToolFn;
}

const kDefaultProps: Partial<IProps> = {
  orientation: "horizontal",
  iconSize: 16,
  buttonSize: 24
};

export function getPlatformTooltip(str: string) {
  const IS_MAC = typeof window != 'undefined' &&
                  /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);
  const modKey = IS_MAC ? "cmd-" : "ctrl-";
  return str.replace("mod-", modKey);
}

export const EditorToolbar: React.FC<IProps> = (iProps: IProps) => {
  const props = { ...kDefaultProps, ...iProps } as Required<IProps>;
  const { orientation, colors, buttonsPerRow, iconSize, buttonSize, buttons,
          onDidInvokeTool, padding, editor } = props;
  const longAxisButtonCount = buttonsPerRow || buttons.length;
  const crossAxisButtonCount = buttonsPerRow ? Math.ceil(buttons.length / buttonsPerRow) : 1;
  const kPadding = padding || 0;
  const toolbarLongExtent = longAxisButtonCount * buttonSize + 2 * kPadding;
  const toolbarCrossExtent = crossAxisButtonCount * buttonSize + 2 * kPadding;
  const toolbarSize = orientation === "vertical"
          ? { width: toolbarCrossExtent, height: toolbarLongExtent }
          : { width: toolbarLongExtent, height: toolbarCrossExtent };
  const toolbarStyle = colors?.buttonColors?.background
                        ? { backgroundColor: colors.buttonColors.background, ...toolbarSize }
                        : toolbarSize;
  const orientationClass = orientation || "horizontal";

  // By default, clicking on a button (such as a toolbar button) takes focus from an
  // active editor. Buttons that want to preserve the current selection, which is the
  // expected behavior for most buttons, should save the selection state before the
  // focus change occurs (e.g. in onMouseDown) and then restore it before making changes.
  const savedSelection = useRef<SelectionJSON>(editor && editor.value.selection.toJSON());
  const handleSaveSelection = useCallback(() => {
    editor && (savedSelection.current = editor.value.selection.toJSON());
  }, [editor]);
  const handleRestoreSelection = useCallback(() => {
    editor && editor.select(savedSelection.current);
  }, [editor]);
  const handleUserActionPerformed = useCallback(() => {
    editor && editor.command("setUserActionPerformed");
  }, [editor]);

  if (iProps.show === false) return null;

  return (
    <div className={`editor-toolbar ${props.className || ""}`}>
      <div className={`editor-toolbar-container ${orientationClass}`} style={toolbarStyle} >
        {
          buttons.map((button, i) => {
            const { format, ...others } = button;
            const key = format ? `key-${format}` : `key-placeholder-${i}`;
            const _iconSize = button.iconSize || iconSize;
            return (
              <ToolbarButton key={`key-${key}`} format={format} iconSize={_iconSize} buttonSize={buttonSize}
                colors={colors?.buttonColors} selectedColors={colors?.selectedColors} onDidInvokeTool={onDidInvokeTool}
                onSaveSelection={handleSaveSelection} onRestoreSelection={handleRestoreSelection}
                onUserActionPerformed={handleUserActionPerformed} {...others} />
            );
          })
        }
      </div>
    </div>
  );
};
