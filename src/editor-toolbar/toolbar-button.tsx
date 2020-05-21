import React, { CSSProperties } from "react";
import { IconProps } from "../assets/icon-props";
import { EFormat, EMetaFormat } from "../common/slate-types";

export type OnMouseFn = (e: React.MouseEvent<HTMLDivElement>) => void;
export type OnClickFn = (format: string, e: React.MouseEvent<HTMLDivElement>) => void;
export type OnChangeColorFn = (color: string) => void;
export type OnChangeFn = OnChangeColorFn;
export type OnDidInvokeToolFn = (format: string) => void;

const kDefaultFillColor = "#909090";
const kDefaultSelectedFillColor = "#009CDC";

export interface IColors {
  fill?: string;
  background?: string;
}

export interface IBaseProps {
  format: EFormat | EMetaFormat;
  SvgIcon: (props: IconProps) => JSX.Element;
  colors?: IColors;
  selectedColors?: IColors;
  tooltip: string;
  isActive: boolean;
  isEnabled?: boolean;
  onMouseDown?: OnMouseFn;
  onClick?: OnClickFn;
  onChange?: OnChangeFn;
  onDidInvokeTool?: OnDidInvokeToolFn;
  onSaveSelection?: () => void;
  onRestoreSelection?: () => void;
}
export interface IProps extends IBaseProps {
  iconSize: number;
  buttonSize: number;
}
export const ToolbarButton: React.FC<IProps> = (props: IProps) => {
  const { format, SvgIcon, iconSize, buttonSize, tooltip, isActive, isEnabled, colors, selectedColors,
          onChange, onClick, onMouseDown, onDidInvokeTool, onSaveSelection, onRestoreSelection } = props;
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
  if (isActive && selectedColors?.background) {
    buttonStyle.backgroundColor = selectedColors.background;
  }
  if (!isActive && colors?.background) {
    buttonStyle.backgroundColor = colors.background;
  }
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    onSaveSelection?.();
    onMouseDown?.(e);
  };
  const handleEnabledClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onRestoreSelection?.();
    if (onClick) {
      onClick(format, e);
      onDidInvokeTool?.(props.format);
      e.preventDefault();
    }
  };
  const handleDisabledClick = () => {
    onRestoreSelection?.();
  };
  // enabled by default
  const handleClick = isEnabled === false ? handleDisabledClick : handleEnabledClick;
  const onChangeProps = onChange ? { onChange } : {};
  const iconProps = { width: iconSize, height: iconSize, fill, ...onChangeProps };
  return (
    <div className="toolbar-button" style={buttonStyle} title={tooltip}
          onMouseDown={handleMouseDown} onClick={handleClick}>
      <div className="toolbar-icon-wrapper" style={wrapperStyle}>
        <SvgIcon className="toolbar-button-icon" {...iconProps} />
      </div>
    </div>
  );
};
