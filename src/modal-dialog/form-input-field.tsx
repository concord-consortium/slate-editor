import React from "react";
import { CustomInput } from "./custom-input";
import { FieldType, IField, IFieldValues } from "./dialog-types";

interface IProps {
  field: IField;
  fieldValues: IFieldValues;
  inputRef?: React.RefObject<HTMLInputElement>;
  inline?: boolean;
  onDOMChange: (name: string, value: string, type: FieldType) => void;
  onValueChange: (name: string, value: string, type: FieldType) => void;
}
export const FormInputField = ({ field, fieldValues, inputRef, inline, onDOMChange, onValueChange }: IProps) => {
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
      className={inline ? "" : "ccrte-full-row"}
      onChange={e => onValueChange(e.target.name, eventValue(e), field.type)}
      onDOMChange={e => onDOMChange(e.target.name, eventValue(e), field.type)}
      type={inputType}
      value={inValue}
      checked={inChecked}
      size={field.charSize}
      inputRef={inputRef}
    />
  );
};
