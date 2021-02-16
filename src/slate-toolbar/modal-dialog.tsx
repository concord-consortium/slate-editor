import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { CustomInput } from "./custom-input";

import './modal-dialog.scss';

export type FieldType = "checkbox" | "input" | "label" | "select";

export type SelectValue = { value: string, label: string };
export type SelectOptions = SelectValue[];

export interface IField {
  name: string;       // should be unique within the dialog
  type: FieldType;
  label?: string;
  charSize?: number;  // mainly for inline inputs
  options?: SelectOptions; // required for select
}

export type IRow = IField | IField[];

// maps name => value
export type IFieldValues = Record<string, string>

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

  // block clicks outside modal
  useEffect(() => {
    const onMouseDown = (e: any) => {
      if (!isMenuOpen && e.target.classList.contains("modal-cover")) {
        e.preventDefault();
      }
    };
    document.addEventListener("mousedown", onMouseDown, true);
    document.addEventListener("touchstart", onMouseDown, true);
    return () => {
      document.removeEventListener("mousedown", onMouseDown, true);
      document.removeEventListener("touchstart", onMouseDown, true);
    };
  }, [isMenuOpen]);

  // auto-focus the first input
  const input1Ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (input1Ref.current) {
      setTimeout(() => input1Ref.current?.focus());
    }
  }, []);

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

  function renderInput(field: IField, index: number, inline: boolean) {
    const inputType = field.type === "checkbox" ? field.type : "text";
    const inValue = field.type === "checkbox"
                      ? undefined
                      : fieldValues[field.name] || "";
    const inChecked = field.type === "checkbox"
                        ? fieldValues[field.name] === "true"
                        : undefined;
    const eventValue = (e: React.ChangeEvent<HTMLInputElement>) => {
      return field.type === "checkbox" ? String(e.target.checked) : e.target.value;
    };
    return (
      <CustomInput
        id={field.name}
        name={field.name}
        className={inline ? "" : "full-row"}
        onChange={e => handleValueChange(e.target.name, eventValue(e), field.type)}
        onDOMChange={e => handleDOMChange(e.target.name, eventValue(e), field.type)}
        type={inputType}
        value={inValue}
        checked={inChecked}
        size={field.charSize}
        inputRef={index===0 ? input1Ref : undefined}
      />
    );
  }

  function renderCheckbox(field: IField, index: number, inline: boolean) {
    return (
      // cf. https://dev.to/proticm/styling-html-checkboxes-is-super-easy-302o
      <label className="checkbox">
        {renderInput(field, index, inline)}
        {field.label && <span>{field.label}</span>}
      </label>
    );
  }

  function renderSelect(field: IField, index: number, inline: boolean) {
    // cf. https://github.com/JedWatson/react-select/issues/1322#issuecomment-605614912
    const customStyles = {
      container: (provided: any) => ({
        ...provided,
        padding: '5px'
      }),
      control: (provided: any, state: any) => ({
        ...provided,
        background: '#fff',
        borderColor: '#9e9e9e',
        borderRadius: '2px',
        minHeight: '30px',
        height: '30px',
        boxShadow: state.isFocused ? null : null,
        cursor: 'pointer'
      }),
      valueContainer: (provided: any) => ({
        ...provided,
        height: '30px',
        padding: '0 6px'
      }),

      input: (provided: any) => ({
        ...provided,
        margin: '0px',
      }),
      indicatorSeparator: (state: any) => ({
        display: 'none',
      }),
      indicatorsContainer: (provided: any) => ({
        ...provided,
        height: '30px',
      }),
      option: (provided: any) => ({
        ...provided,
        cursor: 'pointer'
      }),
    };
    function handleSelectChange(value: any) {
      handleValueChange(field.name, value.value, field.type);
    }
    function getSelectValue(options: SelectOptions | undefined, name: string) {
      return options?.find(opt => opt.value === fieldValues[name]);
    }
    return (
      <Select
        name={field.name}
        styles={customStyles}
        options={field.options}
        value={getSelectValue(field.options, field.name)}
        onChange={handleSelectChange}
        onMenuOpen={() => setIsMenuOpen(true)}
        onMenuClose={() => setIsMenuOpen(false)}/>
    );
  }

  function renderField(field: IField, index: number, inline: boolean) {
    switch (field.type) {
      case "input":
        return renderInput(field, index, inline);
      case "checkbox":
        return renderCheckbox(field, index, inline);
      case "select":
        return renderSelect(field, index, inline);
    }
  }

  function renderEntry(field: IField, index: number, inline: boolean) {
    const inlineClass = inline ? "inline" : "";
    return (
      <div className={`input-entry ${inlineClass} ${field.type}`} key={field.name}>
        {field.label && (field.type !== "checkbox") &&
          <label htmlFor={field.name} className="label">{field.label}</label>}
        {renderField(field, index, inline)}
      </div>
    );
  }

  function renderRow(row: IRow, index: number) {
    if (Array.isArray(row)) {
      return (
        <div className="inline-row" key={`row-${index}`}>
          {row.map(field => renderEntry(field, index, true))}
        </div>
      );
    }
    return renderEntry(row, index, false);
  }

  return (
      <div className={`ccrte-modal-dialog ${props.dialogClassName || ""}`}>
        <div className={`ccrte-modal-cover ${props.coverClassName || ""}`}/>
        <div className="dialog" onKeyDown={handleKeyDown}>
          <div className="header" style={themeStyle}>
            <div style={titleStyle}>{title}</div>
          </div>
          <div className="content">
            {rows.map((row, i) => renderRow(row, i))}
          </div>
          <div className="footer">
            <button ref={okRef} style={themeStyle} onClick={handleOkClick}>OK</button>
            <button style={themeStyle} onClick={handleCancelClick}>CANCEL</button>
          </div>
        </div>
      </div>
  );
};