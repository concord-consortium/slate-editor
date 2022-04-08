import React from "react";
import { FormCheckboxField } from "./form-checkbox-field";
import { FormInputField } from "./form-input-field";
import { FormSelectField } from "./form-select-field";
import { FieldType, IField, IFieldValues } from "./dialog-types";

interface IProps {
  field: IField;
  fieldValues: IFieldValues;
  inputRef?: React.RefObject<HTMLInputElement>;
  inline?: boolean;
  onDOMChange: (name: string, value: string, type: FieldType) => void;
  onValueChange: (name: string, value: string, type: FieldType) => void;
  onSetMenuIsOpen: (isOpen: boolean) => void;
}
export const FormField = ({
  field, fieldValues, inputRef, inline, onDOMChange, onValueChange, onSetMenuIsOpen
}: IProps) => {
  switch (field.type) {
    case "input":
      return (
        <FormInputField field={field} fieldValues={fieldValues} inputRef={inputRef} inline={inline}
          onDOMChange={onDOMChange} onValueChange={onValueChange} />
      );
    case "checkbox":
      return (
        <FormCheckboxField field={field} fieldValues={fieldValues} inputRef={inputRef} inline={inline}
          onDOMChange={onDOMChange} onValueChange={onValueChange} />
      );
    case "select":
      return (
        <FormSelectField field={field} fieldValues={fieldValues} onValueChange={onValueChange}
          onMenuOpen={() => onSetMenuIsOpen(true)} onMenuClose={() => onSetMenuIsOpen(false)} />
      );
  }
  return null;
};
