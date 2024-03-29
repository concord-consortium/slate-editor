import clone from "lodash/clone";
import React, { useEffect, useMemo, useRef, useState }  from "react";
import { Editor } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import { EditorToolbar, getPlatformTooltip } from "../editor-toolbar/editor-toolbar";
import IconBold from "../assets/icon-bold";
import IconCode from "../assets/icon-code";
import IconItalic from "../assets/icon-italic";
import IconImage from "../assets/icon-image";
import IconLink from "../assets/icon-link";
import IconHeading from "../assets/icon-heading";
import IconQuote from "../assets/icon-quote";
import IconBulletedList from "../assets/icon-list-bulleted";
import IconNumberedList from "../assets/icon-list-numbered";
import IconStrikethrough from "../assets/icon-strikethrough";
import IconSubscript from "../assets/icon-subscript";
import IconSuperscript from "../assets/icon-superscript";
import IconUnderline from "../assets/icon-underline";
import InputColor from "../assets/input-color";
// import IconFontIncrease from "../assets/icon-font-increase";
// import IconFontDecrease from "../assets/icon-font-decrease";
import { IButtonSpec, IProps as IToolbarProps } from "../editor-toolbar/editor-toolbar";
import { isBlockActive, isMarkActive, toggleBlock, toggleMark, toggleSuperSubscript } from "../common/slate-utils";
import { EFormat } from "../common/slate-types";
import { DisplayDialogSettings, FieldType, IDialogController, IFieldValues } from "../modal-dialog/dialog-types";
import { ModalDialog } from "../modal-dialog/modal-dialog";
import { ModalDialogPortal } from "../modal-dialog/modal-dialog-portal";
import { CustomElement, CustomMarks } from "../common/custom-types";

export type ToolbarTransform =
  (buttons: IButtonSpec[], editor?: Editor, dialogController?: IDialogController) => IButtonSpec[];
export interface IProps extends Omit<IToolbarProps, "buttons"> {
  transform?: ToolbarTransform;
  modalPortalRoot?: HTMLDivElement;
  modalCoverClassName?: string;
  modalDialogClassName?: string;
}

export const SlateToolbar: React.FC<IProps> = (props: IProps) => {
  const { className, transform, ...others } = props;
  const { colors } = props;
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
  // TODO: Figure out a better way of handling dialogs. Having the toolbar be responsible
  // for the dialogController and the dialog state makes it more difficult to use a custom
  // toolbar (because the dialog component must also be implemented) and leads to convoluted
  // things like the double-click handling in the image plugin which must have the editor
  // emit a message that the toolbar receives so that it can tell the image plugin to display
  // the configuration dialog. One possibility would be to encapsulate the dialog functionality
  // in a custom hook that that can be used by a parent component (e.g. SlateContainer) and
  // then make relevant pieces available via context. One wrinkle is that plugin code can't
  // use hooks (other than in the render function), so perhaps a non-React solution would be
  // better, but the goal should be to isolate the dialog code so that it can be used by all
  // interested parties without having to be replicated in custom toolbar implementations.
  const dialogController: IDialogController = useMemo(() => ({
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
  }), [editor]);

  const defaultButtons: IButtonSpec[] = [
    {
      format: EFormat.bold,
      SvgIcon: IconBold,
      tooltip: getPlatformTooltip("bold (mod-b)"),
      isActive: !!editor && isMarkActive(editor, EFormat.bold),
      onClick: () => toggleMark(editor, EFormat.bold)
    },
    {
      format: EFormat.italic,
      SvgIcon: IconItalic,
      tooltip: getPlatformTooltip("italic (mod-i)"),
      isActive: !!editor && isMarkActive(editor, EFormat.italic),
      onClick: () => toggleMark(editor, EFormat.italic)
    },
    {
      format: EFormat.underlined,
      SvgIcon: IconUnderline,
      tooltip: getPlatformTooltip("underline (mod-u)"),
      isActive: !!editor && isMarkActive(editor, EFormat.underlined),
      onClick: () => toggleMark(editor, EFormat.underlined)
    },
    {
      format: EFormat.deleted,
      SvgIcon: IconStrikethrough,
      tooltip: getPlatformTooltip("strikethrough"),
      isActive: !!editor && isMarkActive(editor, EFormat.deleted),
      onClick: () => toggleMark(editor, EFormat.deleted)
    },
    {
      format: EFormat.code,
      SvgIcon: IconCode,
      tooltip: getPlatformTooltip("code (mod-\\)"),
      isActive: !!editor && isMarkActive(editor, EFormat.code),
      onClick: () => toggleMark(editor, EFormat.code)
    },
    {
      format: EFormat.superscript,
      SvgIcon: IconSuperscript,
      tooltip: getPlatformTooltip("superscript"),
      isActive: !!editor && isMarkActive(editor, EFormat.superscript),
      onClick: () => editor && toggleSuperSubscript(editor, EFormat.superscript)
    },
    {
      format: EFormat.subscript,
      SvgIcon: IconSubscript,
      tooltip: getPlatformTooltip("subscript"),
      isActive: !!editor && isMarkActive(editor, EFormat.subscript),
      onClick: () => editor && toggleSuperSubscript(editor, EFormat.subscript)
    },
    (() => {
      const fill = (editor?.marks as CustomMarks)?.color || "#000000";
      return {
        format: EFormat.color,
        SvgIcon: InputColor,
        colors: { ...colors?.buttonColors, fill },
        selectedColors: { ...colors?.selectedColors, fill },
        tooltip: getPlatformTooltip("color"),
        isActive: !!(editor?.marks as CustomMarks)?.[EFormat.color],
        onChange: (value: string) => {
          return editor?.addMark(EFormat.color, value);
        }
      };
    })(),
    {
      format: EFormat.image,
      SvgIcon: IconImage,
      tooltip: getPlatformTooltip("image"),
      isActive: !!editor.isElementActive(EFormat.image),
      isEnabled: !!editor.isElementEnabled(EFormat.image),
      onClick: () => editor?.configureElement(EFormat.image, dialogController)
    },
    {
      format: EFormat.link,
      SvgIcon: IconLink,
      tooltip: getPlatformTooltip("link"),
      isActive: !!editor.isElementActive(EFormat.link),
      isEnabled: !!editor.isElementEnabled(EFormat.link),
      onClick: () => editor?.configureElement(EFormat.link, dialogController)
    },
    {
      format: EFormat.heading1,
      SvgIcon: IconHeading,
      tooltip: getPlatformTooltip("heading 1"),
      isActive: !!editor && isBlockActive(editor, EFormat.heading1),
      onClick: () => toggleBlock(editor, EFormat.heading1)
    },
    {
      format: EFormat.heading2,
      SvgIcon: IconHeading,
      iconSize: 14,
      tooltip: getPlatformTooltip("heading 2"),
      isActive: !!editor && isBlockActive(editor, EFormat.heading2),
      onClick: () => toggleBlock(editor, EFormat.heading2)
    },
    {
      format: EFormat.heading3,
      SvgIcon: IconHeading,
      iconSize: 12,
      tooltip: getPlatformTooltip("heading 3"),
      isActive: !!editor && isBlockActive(editor, EFormat.heading3),
      onClick: () => toggleBlock(editor, EFormat.heading3)
    },
    // H4-H6 have been removed from the toolbar but are left commented out in case we want to bring them back.
    // {
    //   format: EFormat.heading4,
    //   SvgIcon: IconHeading,
    //   iconSize: 10,
    //   tooltip: getPlatformTooltip("heading 4"),
    //   isActive: !!editor && isBlockActive(editor, EFormat.heading4),
    //   onClick: () => toggleBlock(editor, EFormat.heading4)
    // },
    // {
    //   format: EFormat.heading5,
    //   SvgIcon: IconHeading,
    //   iconSize: 8,
    //   tooltip: getPlatformTooltip("heading 5"),
    //   isActive: !!editor && isBlockActive(editor, EFormat.heading5),
    //   onClick: () => toggleBlock(editor, EFormat.heading5)
    // },
    // {
    //   format: EFormat.heading6,
    //   SvgIcon: IconHeading,
    //   iconSize: 6,
    //   tooltip: getPlatformTooltip("heading 6"),
    //   isActive: !!editor && isBlockActive(editor, EFormat.heading6),
    //   onClick: () => toggleBlock(editor, EFormat.heading6)
    // },
    {
      format: EFormat.blockQuote,
      SvgIcon: IconQuote,
      tooltip: getPlatformTooltip("block quote"),
      isActive: !!editor && isBlockActive(editor, EFormat.blockQuote),
      onClick: () => toggleBlock(editor, EFormat.blockQuote)
    },
    {
      format: EFormat.numberedList,
      SvgIcon: IconNumberedList,
      tooltip: getPlatformTooltip("numbered list"),
      isActive: !!editor && isBlockActive(editor, EFormat.numberedList),
      onClick: () => toggleBlock(editor, EFormat.numberedList)
    },
    {
      format: EFormat.bulletedList,
      SvgIcon: IconBulletedList,
      tooltip: getPlatformTooltip("bulleted list"),
      isActive: !!editor && isBlockActive(editor, EFormat.bulletedList),
      onClick: () => toggleBlock(editor, EFormat.bulletedList)
    },
    // {
    //   format: EMetaFormat.fontDecrease,
    //   SvgIcon: IconFontDecrease,
    //   tooltip: getPlatformTooltip("decrease font"),
    //   isActive: false,
    //   onClick: () => editor?.command("decreaseFontSize")
    // },
    // {
    //   format: EMetaFormat.fontIncrease,
    //   SvgIcon: IconFontIncrease,
    //   tooltip: getPlatformTooltip("increase font"),
    //   isActive: false,
    //   onClick: () => editor?.command("increaseFontSize")
    // }
  ];

  const buttons = transform ? transform(defaultButtons, editor, dialogController) : defaultButtons;

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

  // listen for configuration requests from plugins
  useEffect(() => {
    const handler = (elt: CustomElement) => {
      editor.configureElement(elt.type, dialogController, elt);
    };

    editor.onEvent("toolbarDialog", handler);

    return () => editor.offEvent("toolbarDialog", handler);
  }, [editor, dialogController]);

  return (
    <div>
      <EditorToolbar
        className={`ccrte-toolbar slate-toolbar ${props.className || ""}`}
        iconSize={16}
        buttons={buttons}
        {...others}
        />
      {dialog}
    </div>
  );
};
