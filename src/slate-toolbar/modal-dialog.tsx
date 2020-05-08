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
        <div className="modal-cover"/>
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
            <button style={themeStyle} onClick={handleOkClick}>OK</button>
            <button style={themeStyle} onClick={handleCancelClick}>CANCEL</button>
          </div>
        </div>
      </div>
  )
}