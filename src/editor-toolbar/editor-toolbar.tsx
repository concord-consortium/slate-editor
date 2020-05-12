import React, { useCallback, useRef } from "react";
import { IBaseProps, IColors, OnDidInvokeToolFn, ToolbarButton } from "./toolbar-button";
import { Editor } from "slate-react";
import { SelectionJSON } from "slate";

export interface IButtonSpec extends IBaseProps {
  iconSize?: number;
}

export interface IProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
  colors?: IColors;
  selectedColors?: IColors;
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

// let renderCount = 0;

export const EditorToolbar: React.FC<IProps> = (iProps: IProps) => {
  // console.log("SlateEditor.renderCount:", ++renderCount);

  const props = { ...kDefaultProps, ...iProps } as Required<IProps>;
  const { orientation, colors, selectedColors, buttonsPerRow, iconSize, buttonSize, buttons,
          onDidInvokeTool, editor } = props;
  const longAxisButtonCount = buttonsPerRow || buttons.length;
  const crossAxisButtonCount = buttonsPerRow ? Math.ceil(buttons.length / buttonsPerRow) : 1;
  const toolbarLongExtent = longAxisButtonCount * buttonSize;
  const toolbarCrossExtent = crossAxisButtonCount * buttonSize;
  const toolbarSize = orientation === "vertical"
          ? { width: toolbarCrossExtent, height: toolbarLongExtent }
          : { width: toolbarLongExtent, height: toolbarCrossExtent };
  const toolbarStyle = colors?.background
                        ? { backgroundColor: colors.background, ...toolbarSize }
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

  if (iProps.show === false) return null;

  return (
    <div className={`editor-toolbar ${props.className || ""}`}>
      <div className={`editor-toolbar-container ${orientationClass}`} style={toolbarStyle} >
        {
          buttons.map(button => {
            const { format, ...others } = button;
            const _iconSize = button.iconSize || iconSize;
            return (
              <ToolbarButton key={`key-${format}`} format={format} iconSize={_iconSize} buttonSize={buttonSize}
                colors={colors} selectedColors={selectedColors} onDidInvokeTool={onDidInvokeTool}
                onSaveSelection={handleSaveSelection} onRestoreSelection={handleRestoreSelection} {...others} />
            );
          })
        }
      </div>
    </div>
  );
};
