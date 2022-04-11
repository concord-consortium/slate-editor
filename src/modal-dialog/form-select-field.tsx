import React from "react";
import Select from "react-select";
import { FieldType, IField, IFieldValues, SelectOptions } from "./dialog-types";

interface IProps {
  field: IField;
  fieldValues: IFieldValues;
  onMenuOpen: () => void;
  onMenuClose: () => void;
  onValueChange: (name: string, value: string, type: FieldType) => void;
}
export const FormSelectField = ({ field, fieldValues, onMenuOpen, onMenuClose, onValueChange }: IProps) => {
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
    onValueChange(field.name, value.value, field.type);
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
      onMenuOpen={onMenuOpen}
      onMenuClose={onMenuClose}/>
  );
};
