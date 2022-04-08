import React from "react";
import { FormField } from "./form-field";
import { FieldType, IField, IFieldValues } from "./dialog-types";

import "./form-field-entry.scss";

interface IProps {
  field: IField;
  fieldValues: IFieldValues;
  inputRef?: React.RefObject<HTMLInputElement>;
  inline?: boolean;
  onDOMChange: (name: string, value: string, type: FieldType) => void;
  onValueChange: (name: string, value: string, type: FieldType) => void;
  onSetMenuIsOpen: (isOpen: boolean) => void;
}
export const FormFieldEntry = ({
  field, fieldValues, inputRef, inline, onDOMChange, onValueChange, onSetMenuIsOpen
}: IProps) => {
    const inlineClass = inline ? "ccrte-inline" : "";
    return (
      <div className={`ccrte-form-field ${inlineClass} ${field.type}`} key={field.name}>
        {field.label && (field.type !== "checkbox") &&
          <label htmlFor={field.name} className="ccrte-label">{field.label}</label>}
        <FormField field={field} fieldValues={fieldValues} inline={inline} inputRef={inputRef}
          onDOMChange={onDOMChange} onValueChange={onValueChange} onSetMenuIsOpen={onSetMenuIsOpen} />
      </div>
    );
};
