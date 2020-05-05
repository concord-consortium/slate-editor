import React from "react";
import { IBaseProps, ToolbarButton } from "./toolbar-button";

export interface IButtonSpec extends IBaseProps {
  iconSize?: number;
}

export interface IProps {
  show?: boolean;
  className?: string;
  orientation?: "horizontal" | "vertical";
  buttonsPerRow?: number;
  iconSize?: number;
  buttonSize?: number;
  buttons: IButtonSpec[];
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

  if (iProps.show === false) return null;

  const props = { ...kDefaultProps, ...iProps } as Required<IProps>;
  const { orientation, buttonsPerRow, iconSize, buttonSize, buttons } = props;
  const longAxisButtonCount = buttonsPerRow || buttons.length;
  const crossAxisButtonCount = buttonsPerRow ? Math.ceil(buttons.length / buttonsPerRow) : 1;
  const toolbarLongExtent = longAxisButtonCount * buttonSize;
  const toolbarCrossExtent = crossAxisButtonCount * buttonSize;
  const toolbarStyle = orientation === "vertical"
          ? { width: toolbarCrossExtent, height: toolbarLongExtent }
          : { width: toolbarLongExtent, height: toolbarCrossExtent };
  const orientationClass = orientation || "horizontal";

  return (
    <div className={`editor-toolbar ${props.className || ""}`}>
      <div className={`editor-toolbar-container ${orientationClass}`} style={toolbarStyle} >
        {
          buttons.map(button => {
            const { format, ...others } = button;
            const _iconSize = button.iconSize || iconSize;
            return (
              <ToolbarButton key={`key-${format}`} format={format} {...others}
                              iconSize={_iconSize} buttonSize={buttonSize} />
            );
          })
        }
      </div>
    </div>
  );
};
