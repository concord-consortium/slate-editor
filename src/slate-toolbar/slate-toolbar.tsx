import clone from "lodash/clone";
import React, { useEffect, useRef, useState }  from "react";
import { Editor } from "slate";
import { ReactEditor, useSlate } from "slate-react";
// import IconFontIncrease from "../assets/icon-font-increase";
// import IconFontDecrease from "../assets/icon-font-decrease";
import { EFormat } from "../common/slate-types";
import { EFormatOrButtonSpec, getToolbarButton, IButtonSpec, setDialogController } from "../common/toolbar-utils";
import { EditorToolbar, IProps as IToolbarProps } from "../editor-toolbar/editor-toolbar";
import { DisplayDialogSettings, FieldType, IDialogController, IFieldValues } from "../modal-dialog/dialog-types";
import { ModalDialog } from "../modal-dialog/modal-dialog";
import { ModalDialogPortal } from "../modal-dialog/modal-dialog-portal";

export type ToolbarTransform =
  (buttons: IButtonSpec[], editor?: Editor, dialogController?: IDialogController) => IButtonSpec[];
export interface IProps extends Omit<IToolbarProps, "buttons"> {
  buttons?: EFormatOrButtonSpec[];
  transform?: ToolbarTransform;
  modalPortalRoot?: HTMLDivElement;
  modalCoverClassName?: string;
  modalDialogClassName?: string;
}

export const SlateToolbar: React.FC<IProps> = (props: IProps) => {
  const { className, buttons: inButtons, transform, ...others } = props;
  const editor = useSlate();
  const [showDialog, setShowDialog] = useState(false);
  const settingsRef = useRef<DisplayDialogSettings>();
  const validValuesRef = useRef<IFieldValues>();
  const [ , setChanges] = useState(0);
  const setFieldValues = (newValues: IFieldValues) => {
    if (!settingsRef.current) return;
    settingsRef.current.values = { ...settingsRef.current.values, ...newValues };
    setChanges(count => count + 1);
  };
  const validateFieldValues = () => {
    if (settingsRef.current) {
      validValuesRef.current = clone(settingsRef.current.values);
    }
  };

  useEffect(() => {
    // Dialog controller can be used by plugins to implement dialogs like the default dialogs.
    // The dialog controller can be retrieved by clients using getDialogController(editor).
    // Plugins are free to use their own dialog implementations instead of the dialog controller.
    const controller: IDialogController = {
      display: (settings: DisplayDialogSettings) => {
        settingsRef.current = settings;
        validateFieldValues();
        // prevents focus-bouncing between editor and dialog
        ReactEditor.blur(editor);
        setShowDialog(true);
      },
      update: (newValues: IFieldValues) => {
        setFieldValues(newValues);
        validateFieldValues();
      }
    };
    setDialogController(editor, controller);
  }, [editor]);

  const defaultButtons: EFormatOrButtonSpec[] = [
    EFormat.bold,
    EFormat.italic,
    EFormat.underlined,
    EFormat.deleted,
    EFormat.code,
    EFormat.superscript,
    EFormat.subscript,
    EFormat.color,
    EFormat.image,
    EFormat.link,
    EFormat.heading1,
    EFormat.heading2,
    EFormat.heading3,
    EFormat.blockQuote,
    EFormat.numberedList,
    EFormat.bulletedList,
    // {
    //   format: EMetaFormat.fontDecrease,
    //   SvgIcon: IconFontDecrease,
    //   tooltip: getPlatformTooltip("decrease font"),
    //   isActive: () => false,
    //   onClick: () => editor?.command("decreaseFontSize")
    // },
    // {
    //   format: EMetaFormat.fontIncrease,
    //   SvgIcon: IconFontIncrease,
    //   tooltip: getPlatformTooltip("increase font"),
    //   isActive: () => false,
    //   onClick: () => editor?.command("increaseFontSize")
    // }
  ];

  const _buttonSpecs = (inButtons ?? defaultButtons).map(spec => {
    return typeof spec === "string" ? getToolbarButton(editor, spec) : spec;
  }).filter(specs => !!specs);
  const buttonSpecs = transform ? transform(_buttonSpecs) : _buttonSpecs;

  const handleSetValue = (name: string, value: string, type: FieldType) => {
    setFieldValues({ [name]: value });
    if (type !== "input") {
      callOnChange(name, value);
    }
  };

  const handleChange = (name: string, value: string, type: FieldType) => {
    if (type === "input") {
      callOnChange(name, value);
    }
  };

  const callOnChange = (name: string, value: string) => {
    if (editor && settingsRef.current?.onChange) {
      const { values } = settingsRef.current;
      const isValid = settingsRef.current.onChange(editor, name, value, values) !== false;
      if (isValid) {
        validateFieldValues();
      }
      else {
        setFieldValues({ [name]: validValuesRef.current?.[name] || "" });
      }
    }
  };

  const handleClose = (values?: IFieldValues) => {
    setShowDialog(false);
    editor && values && settingsRef.current?.onAccept?.(editor, values);
    settingsRef.current?.onClose?.(editor);
  };

  const themeColor = props.colors?.themeColor || props.colors?.buttonColors?.background;
  const dialog = showDialog && settingsRef.current
                  ? (props.modalPortalRoot
                      ? <ModalDialogPortal
                          modalPortalRoot={props.modalPortalRoot}
                          coverClassName={props.modalCoverClassName}
                          dialogClassName={props.modalDialogClassName}
                          themeColor={themeColor}
                          title={settingsRef.current.title}
                          rows={settingsRef.current.rows}
                          fieldValues={settingsRef.current.values}
                          onSetValue={handleSetValue}
                          onChange={handleChange}
                          onValidate={settingsRef.current.onValidate}
                          onClose={handleClose}
                        />
                      : <ModalDialog
                          coverClassName={props.modalCoverClassName}
                          dialogClassName={props.modalDialogClassName}
                          themeColor={themeColor}
                          title={settingsRef.current.title}
                          rows={settingsRef.current.rows}
                          fieldValues={settingsRef.current.values}
                          onSetValue={handleSetValue}
                          onChange={handleChange}
                          onValidate={settingsRef.current.onValidate}
                          onClose={handleClose}
                        />)
                  : null;

  return (
    <>
      <EditorToolbar
        className={`ccrte-toolbar slate-toolbar ${props.className || ""}`}
        iconSize={16}
        buttons={buttonSpecs}
        {...others}
        />
      {dialog}
    </>
  );
};
