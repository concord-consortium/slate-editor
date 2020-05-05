import React from "react";
import { IconProps } from "../assets/icon-props";

export type OnMouseFn = (e: React.MouseEvent<HTMLDivElement>) => void;
export type OnClickFn = (format: string, e: React.MouseEvent<HTMLDivElement>) => void;
export type OnChangeColorFn = (color: string) => void;
export type OnChangeFn = OnChangeColorFn;

export interface IBaseProps {
  format: string;
  SvgIcon: (props: IconProps) => JSX.Element;
  tooltip: string;
  isActive: boolean;
  onMouseDown?: OnMouseFn;
  onClick?: OnClickFn;
  onChange?: OnChangeFn;
  onSaveSelection?: () => void;
  onRestoreSelection?: () => void;
}
export interface IProps extends IBaseProps {
  iconSize: number;
  buttonSize: number;
}
export const ToolbarButton: React.FC<IProps> = (props: IProps) => {
  const { format, SvgIcon, iconSize, buttonSize, tooltip, isActive,
          onChange, onClick, onMouseDown, onSaveSelection, onRestoreSelection } = props;
  const buttonStyle = {
          width: buttonSize,
          height: buttonSize
        };
  const wrapperStyle = {
          width: iconSize,
          height: iconSize
        };
  const fill = isActive ? "#009CDC" : "#909090";
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    onSaveSelection?.();
    onMouseDown?.(e);
  };
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onRestoreSelection?.();
    if (onClick) {
      onClick(format, e);
      e.preventDefault();
    }
  };
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
