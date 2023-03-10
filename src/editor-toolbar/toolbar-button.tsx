import React, { CSSProperties } from "react";
import { IconProps } from "../assets/icon-props";
import { EFormat, EMetaFormat } from "../common/slate-types";

export type OnClickFn = (format: string) => void;
export type OnChangeColorFn = (color: string) => void;
export type OnChangeFn = OnChangeColorFn;
export type OnDidInvokeToolFn = (format: string) => void;

const kDefaultFillColor = "#909090";
const kDefaultSelectedFillColor = "#009CDC";

export interface IButtonColors {
  fill?: string;
  background?: string;
}

export interface IBaseProps {
  format: EFormat | EMetaFormat | null;
  SvgIcon?: (props: IconProps) => JSX.Element;
  colors?: IButtonColors;
  selectedColors?: IButtonColors;
  tooltip?: string;
  isActive?: boolean;
  isEnabled?: boolean;
  onClick?: OnClickFn;
  onChange?: OnChangeFn;
  onDidInvokeTool?: OnDidInvokeToolFn;
}
export interface IProps extends IBaseProps {
  iconSize: number;
  buttonSize: number;
}
export const ToolbarButton: React.FC<IProps> = (props: IProps) => {
  const {
    format, SvgIcon, iconSize, buttonSize, tooltip, isActive, isEnabled, colors, selectedColors,
    onChange, onClick, onDidInvokeTool
  } = props;
  const buttonStyle: CSSProperties = {
          width: buttonSize,
          height: buttonSize
        };
  const wrapperStyle = {
          width: iconSize,
          height: iconSize
        };
  const fill = isActive
                ? (selectedColors?.fill || kDefaultSelectedFillColor)
                : (colors?.fill || kDefaultFillColor);
  if (format && isActive && selectedColors?.background) {
    buttonStyle.backgroundColor = selectedColors.background;
  }
  else if (colors?.background) {
    buttonStyle.backgroundColor = colors.background;
  }
  const handlePointerDown = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    // trigger on mouse down and prevent default to prevent focus change
    if (format && onClick) {
      onClick(format);
      onDidInvokeTool?.(format);
    }
    e.preventDefault();
    e.stopPropagation();
  };
  // enabled by default
  const onChangeProps = onChange ? { onChange } : {};
  const iconProps = { width: iconSize, height: iconSize, fill, ...onChangeProps };
  return (
    <div className={`toolbar-button ${isEnabled === false ? "disabled" : ""}`} style={buttonStyle} title={tooltip}
          onMouseDown={handlePointerDown} onTouchStart={handlePointerDown}>
      {!!format && SvgIcon &&
        <div className="toolbar-icon-wrapper" style={wrapperStyle}>
          <SvgIcon className="toolbar-button-icon" {...iconProps} />
        </div>}
    </div>
  );
};
