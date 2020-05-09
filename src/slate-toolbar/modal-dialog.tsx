import React, { useState, useEffect, useRef }  from "react";

import './modal-dialog.scss';

export interface IProps {
  coverClassName?: string;
  dialogClassName?: string;
  themeColor?: string;
  fontColor?: string;
  title: string;
  inputFieldStrings: string[];
  onClose: (inputFieldValues: string[] | null) => void;
}

export const ModalDialog: React.FC<IProps> = (props) => {
  const { themeColor, fontColor, title, inputFieldStrings } = props;

  // CSS styles
  const themeStyle = themeColor ? {backgroundColor: `${themeColor}`} : undefined;
  const titleStyle = fontColor ? {color: `${fontColor}`} : undefined;

  // useState useEffect hooks
  const initialValues = inputFieldStrings.map(() => "");
  const [inputValues, setInputValue] = useState(initialValues);
  const [valueChange, setValueChange] = useState(false);
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
    if (!valueChange) {
      input1Ref?.current?.focus();
    }
  });

  // handlers
  const handleCancelClick = () => {
    props.onClose(null);
  };
  const handleOkClick = () => {
    props.onClose(inputValues);
  };
  const handleValueChange = (index: number) => (e: any) => {
    const newArr = [...inputValues];
    newArr[index] = e.target.value;
    setInputValue(newArr);
    setValueChange(true);
  };

  return (
      <div className={`modal-dialog ${props.dialogClassName || ""}`}>
        <div className={`modal-cover ${props.coverClassName || ""}`}/>
        <div className="dialog">
          <div className="header" style={themeStyle}>
            <div style={titleStyle}>{title}</div>
          </div>
          <div className="content">
          {
            inputFieldStrings.map((input, i) => {
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