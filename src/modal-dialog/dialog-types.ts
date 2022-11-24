import { Editor } from "slate-react";

export type FieldType = "checkbox" | "input" | "label" | "select";

export type SelectValue = { value: string; label: string };
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
export type IFieldValues = Record<string, string>;

export interface DisplayDialogSettings {
  title: string;
  rows: IRow[];
  values: IFieldValues;
  onChange?: (editor: Editor, name: string, value: string, values: IFieldValues) => boolean | undefined;
  onValidate?: (values: IFieldValues) => IFieldValues | string;
  onAccept?: (editor: Editor, values: IFieldValues) => void;
}

export interface IDialogController {
  display: (settings: DisplayDialogSettings) => void;
  update: (values: IFieldValues) => void;
}
