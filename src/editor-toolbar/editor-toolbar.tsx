import React from "react";
import { IButtonSpec } from "../common/toolbar-utils";
import { IButtonColors, ToolbarButton } from "./toolbar-button";

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
  show?: boolean;
  onDidInvokeTool?: (format: string) => void;
}

const kDefaultProps: Partial<IProps> = {
  orientation: "horizontal",
  iconSize: 16,
  buttonSize: 24
};

export const EditorToolbar: React.FC<IProps> = (iProps: IProps) => {
  const props = { ...kDefaultProps, ...iProps } as Required<IProps>;
  const { orientation, colors, buttonsPerRow, iconSize, buttonSize, buttons, padding } = props;
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

  if (iProps.show === false) return null;

  return (
    <div className={`editor-toolbar ${props.className || ""}`}>
      <div className={`editor-toolbar-container ${orientationClass}`} style={toolbarStyle} >
        {
          buttons.map((button, i) => {
            const { format, colors: colorsFn, selectedColors: selectedColorsFn, ...others } = button;
            const key = format ? `key-${format}` : `key-placeholder-${i}`;
            const _iconSize = button.iconSize || iconSize;
            const _colors = colorsFn?.(colors?.buttonColors ?? {}) ?? colors?.buttonColors;
            const _selectedColors = selectedColorsFn?.(colors?.selectedColors ?? {}) ?? colors?.selectedColors;
            return (
              <ToolbarButton key={`key-${key}`} format={format} iconSize={_iconSize} buttonSize={buttonSize}
                colors={_colors} selectedColors={_selectedColors} {...others} />
            );
          })
        }
      </div>
    </div>
  );
};
