import React from "react";

import "./dialog-header.scss";

interface IProps {
  themeStyle?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  title: string;
}
export const DialogHeader = ({ themeStyle, titleStyle, title }: IProps) => {
  return (
    <div className="ccrte-dialog-header" style={themeStyle}>
      <div style={titleStyle}>{title}</div>
    </div>
  );
};
