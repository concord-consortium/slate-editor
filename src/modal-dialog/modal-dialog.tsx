import React, { useState, useRef } from "react";
import { DialogContent } from "./dialog-content";
import { DialogFooter } from "./dialog-footer";
import { DialogHeader } from "./dialog-header";
import { ModalCover } from "./modal-cover";
import { FieldType, IFieldValues, IRow } from "./dialog-types";

import './modal-dialog.scss';

export interface IProps {
  coverClassName?: string;
  dialogClassName?: string;
  themeColor?: string;
  fontColor?: string;
  title: string;
  rows: IRow[];
  fieldValues: IFieldValues;
  onSetValue: (name: string, value: string, type: FieldType) => void;
  onChange?: (name: string, value: string, type: FieldType) => void;
  // string indicates error message
  onValidate?: (values: IFieldValues) => IFieldValues | string;
  onClose: (values?: IFieldValues) => void;
}

export const ModalDialog: React.FC<IProps> = (props) => {
  const { themeColor, fontColor, title, rows, fieldValues, onSetValue, onChange, onValidate, onClose } = props;

  // CSS styles
  const themeStyle = themeColor ? {backgroundColor: `${themeColor}`} : undefined;
  const titleStyle = fontColor ? {color: `${fontColor}`} : undefined;

  // state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // handlers
  const okRef = useRef<HTMLButtonElement>(null);
  const handleCancelClick = () => {
    onClose();
  };
  const handleOkClick = () => {
    const validated = onValidate ? onValidate(fieldValues) : fieldValues;
    if (typeof validated === "string") {
      alert(validated);
    }
    else {
      onClose(validated);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isMenuOpen) {
      if ((e.key === "Enter") || (e.keyCode === 13)) {
        // blur any active edit
        okRef.current?.focus();
        // give blur a chance to propagate
        setTimeout(() => okRef.current?.click());
      }
      else if ((e.key === "Escape") || (e.keyCode === 27)) {
        handleCancelClick();
      }
    }
  };
  const handleValueChange = (name: string, value: string, type: FieldType) => {
    onSetValue(name, value, type);
  };
  const handleDOMChange = (name: string, value: string, type: FieldType) => {
    onChange?.(name, value, type);
  };

  return (
    <div className={`ccrte-modal-dialog ${props.dialogClassName || ""}`}>
      <ModalCover className={props.coverClassName} allowOutsideClick={isMenuOpen} />
      <div className="ccrte-dialog" onKeyDown={handleKeyDown}>
        <DialogHeader themeStyle={themeStyle} titleStyle={titleStyle} title={title} />
        <DialogContent rows={rows} fieldValues={fieldValues} onSetMenuIsOpen={setIsMenuOpen}
          onDOMChange={handleDOMChange} onValueChange={handleValueChange} />
        <DialogFooter themeStyle={themeStyle} okRef={okRef}
          onCancelClick={handleCancelClick} onOkClick={handleOkClick} />
      </div>
    </div>
  );
};
