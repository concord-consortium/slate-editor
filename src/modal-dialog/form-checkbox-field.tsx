import React from "react";
import { FieldType, IField, IFieldValues } from "./dialog-types";
import { FormInputField } from "./form-input-field";

import "./form-checkbox-field.scss";

interface IProps {
  field: IField;
  fieldValues: IFieldValues;
  inputRef?: React.RefObject<HTMLInputElement>;
  inline?: boolean;
  onDOMChange: (name: string, value: string, type: FieldType) => void;
  onValueChange: (name: string, value: string, type: FieldType) => void;
}
export const FormCheckboxField = ({ field, fieldValues, inputRef, inline, onDOMChange, onValueChange }: IProps) => {
  return (
    // cf. https://dev.to/proticm/styling-html-checkboxes-is-super-easy-302o
    <label className="ccrte-checkbox-field">
      <FormInputField field={field} fieldValues={fieldValues} inputRef={inputRef} inline={inline}
        onDOMChange={onDOMChange} onValueChange={onValueChange} />
      {field.label && <span>{field.label}</span>}
    </label>
  );
};
