import React from "react";

import "./dialog-footer.scss";

interface IProps {
  themeStyle?: React.CSSProperties;
  okRef: React.RefObject<HTMLButtonElement>;
  onCancelClick: () => void;
  onOkClick: () => void;
}
export const DialogFooter = ({ themeStyle, okRef, onCancelClick, onOkClick }: IProps) => {
  return (
    <div className="ccrte-dialog-footer">
      <button style={themeStyle} onClick={() => onCancelClick()}>Cancel</button>
      <button ref={okRef} style={themeStyle} onClick={() => onOkClick()}>OK</button>
    </div>
  );
};
