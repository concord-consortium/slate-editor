import React, { useEffect, useRef } from "react";
import { FormFieldEntry } from "./form-field-entry";
import { FieldType, IField, IFieldValues, IRow } from "./dialog-types";

import "./dialog-content.scss";

interface IProps {
  rows: IRow[];
  fieldValues: IFieldValues;
  onDOMChange: (name: string, value: string, type: FieldType) => void;
  onValueChange: (name: string, value: string, type: FieldType) => void;
  onSetMenuIsOpen: (isOpen: boolean) => void;
}
export const DialogContent = ({ rows, fieldValues, onDOMChange, onValueChange, onSetMenuIsOpen }: IProps) => {
  // auto-focus the first input
  const input1Ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (input1Ref.current) {
      setTimeout(() => input1Ref.current?.focus());
    }
  }, []);

  function renderEntry(field: IField, rowIndex: number, fieldIndex: number, inline: boolean) {
    return (
      <FormFieldEntry key={`field-${rowIndex}-${fieldIndex}`} field={field} fieldValues={fieldValues} inline={inline}
        inputRef={rowIndex + fieldIndex === 0 ? input1Ref : undefined} onSetMenuIsOpen={onSetMenuIsOpen}
        onDOMChange={onDOMChange} onValueChange={onValueChange} />
    );
  }

  function renderRow(row: IRow, rowIndex: number) {
    if (Array.isArray(row)) {
      return (
        <div className="ccrte-inline-row" key={`row-${rowIndex}`}>
          {row.map((field, fieldIndex) => renderEntry(field, rowIndex, fieldIndex, true))}
        </div>
      );
    }
    return renderEntry(row, rowIndex, 0, false);
  }

  return (
    <div className="ccrte-dialog-content">
      {rows.map((row, i) => renderRow(row, i))}
    </div>
  );
};
