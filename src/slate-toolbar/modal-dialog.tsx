import React, { useState, useEffect }  from "react";

import './modal-dialog.scss';

export interface IProps {
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
  useEffect(() => {
    const onDown = (e: any) => {
      if (!e.target.classList.contains("modal-dialog-input", "modal-dialog-button")) {
        console.log("prevent");
        e.preventDefault();
        //e.stopPropagation();
        //e.stopImmediatePropagation();
      }   
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, []);  

  // handlers
  const handleCancelClick = () => {
    props.onClose(null);
  }
  const handleOkClick = () => {
    props.onClose(inputValues);
  }
  const handleValueChange = (index: number) => (e: any) => {
    let newArr = [...inputValues];
    newArr[index] = e.target.value;
    setInputValue(newArr); 
  }
  
  return (
      <div className="modal-dialog">
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
                  className={"modal-dialog-input"}
                  autoFocus={i==0}
                  onChange={handleValueChange(i)}
                  type="text"
                  value={inputValues[i]}
                />
              </div>
            );
          })
        }
        </div>
        <div className="footer">
          <button className={"modal-dialog-button"} style={themeStyle} onClick={handleOkClick}>OK</button>
          <button className={"modal-dialog-button"} style={themeStyle} onClick={handleCancelClick}>CANCEL</button>
        </div>
      </div>
  )
}