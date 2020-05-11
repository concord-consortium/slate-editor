import React, { useState, useEffect, useRef }  from "react";

import './modal-dialog.scss';

export interface IProps {
  coverClassName?: string;
  dialogClassName?: string;
  themeColor?: string;
  fontColor?: string;
  title: string;
  prompts: string[];
  onClose: (inputs: string[] | null) => void;
}

export const ModalDialog: React.FC<IProps> = (props) => {
  const { themeColor, fontColor, title, prompts } = props;

  // CSS styles
  const themeStyle = themeColor ? {backgroundColor: `${themeColor}`} : undefined;
  const titleStyle = fontColor ? {color: `${fontColor}`} : undefined;

  // useState useEffect hooks
  const initialValues = prompts.map(() => "");
  const [inputValues, setInputValue] = useState(initialValues);
  useEffect(() => {
    const onMouseDown = (e: any) => {
      if (e.target.classList.contains("modal-cover")) {
        e.preventDefault();
      }
    };
    document.addEventListener("mousedown", onMouseDown, true);
    document.addEventListener("touchstart", onMouseDown, true);
    return () => {
      document.removeEventListener("mousedown", onMouseDown, true);
      document.removeEventListener("touchstart", onMouseDown, true);
    };
  }, []);
  const input1Ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setTimeout(() => input1Ref?.current?.focus());
  }, []);

  // handlers
  const handleCancelClick = () => {
    props.onClose(null);
  };
  const handleOkClick = () => {
    props.onClose(inputValues);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === "Enter") || (e.keyCode === 13)) return handleOkClick();
    if ((e.key === "Escape") || (e.keyCode === 27)) return handleCancelClick();
  };
  const handleValueChange = (index: number) => (e: any) => {
    const newArr = [...inputValues];
    newArr[index] = e.target.value;
    setInputValue(newArr);
  };

  return (
      <div className={`modal-dialog ${props.dialogClassName || ""}`}>
        <div className={`modal-cover ${props.coverClassName || ""}`}/>
        <div className="dialog" onKeyDown={handleKeyDown}>
          <div className="header" style={themeStyle}>
            <div style={titleStyle}>{title}</div>
          </div>
          <div className="content">
          {
            prompts.map((input, i) => {
              return (
                <div className="input-entry" key={`input-${i}`}>
                  <div className="label">{input}</div>
                  <input
                    onChange={handleValueChange(i)}
                    type="text"
                    value={inputValues[i]}
                    ref={i===0 ? input1Ref : undefined}
                  />
                </div>
              );
            })
          }
          </div>
          <div className="footer">
            <button style={themeStyle} onClick={handleOkClick}>OK</button>
            <button style={themeStyle} onClick={handleCancelClick}>CANCEL</button>
          </div>
        </div>
      </div>
  );
};