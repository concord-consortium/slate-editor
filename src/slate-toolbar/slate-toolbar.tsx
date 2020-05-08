import React, { useState }  from "react";
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
import IconFontIncrease from "../assets/icon-font-increase";
import IconFontDecrease from "../assets/icon-font-decrease";
import { IButtonSpec, IProps as IToolbarProps } from "../editor-toolbar/editor-toolbar";
import { handleToggleListBlock, handleToggleMark, hasActiveMark, selectionContainsBlock,
          handleToggleSuperSubscript, handleToggleBlock }
        from "../slate-editor/slate-utils";
import { SelectionJSON } from "slate";
import { EFormat, EMetaFormat } from "../common/slate-types";
import { ModalDialog } from "./modal-dialog";
import { ModalDialogPortal } from "./modal-dialog-portal";

export interface IProps extends Omit<IToolbarProps, "buttons"> {
  order?: Array<EFormat | EMetaFormat>;
  modalPortalRoot?: HTMLDivElement;
  changeCount: number;
}

function sortButtons(buttons: IButtonSpec[], order: Array<EFormat | EMetaFormat>) {
  const formatOrder: Record<string, number> = {};
  order.forEach((format, index) => {
    formatOrder[format] = index + 1;  // skip 0
  });
  buttons.forEach((button, index) => {
    if (!formatOrder[button.format]) {
      // unordered buttons come after ordered buttons in original order
      formatOrder[button.format] = 101 + index;
    }
  });
  buttons.sort((button1, button2) => formatOrder[button1.format] - formatOrder[button2.format]);
}

export const SlateToolbar: React.FC<IProps> = (props: IProps) => {
  const { className, editor, order, ...others } = props;
  const [showDialog, setShowDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogInputs, setDialogInputs] = useState([""]);
  const [dialogCommand, setDialogCommand] = useState("");  
  const buttons: IButtonSpec[] = [
    {
      format: EFormat.bold,
      SvgIcon: IconBold,
      tooltip: getPlatformTooltip("bold (mod-b)"),
      isActive: editor ? hasActiveMark(editor.value, EFormat.bold) : false,
      onClick: () => editor && handleToggleMark(EFormat.bold, editor)
    },
    {
      format: EFormat.italic,
      SvgIcon: IconItalic,
      tooltip: getPlatformTooltip("italic (mod-i)"),
      isActive: editor ? hasActiveMark(editor.value, EFormat.italic) : false,
      onClick: () => editor && handleToggleMark(EFormat.italic, editor)
    },
    {
      format: EFormat.underlined,
      SvgIcon: IconUnderline,
      tooltip: getPlatformTooltip("underline (mod-u)"),
      isActive: editor ? hasActiveMark(editor.value, EFormat.underlined) : false,
      onClick: () => editor && handleToggleMark(EFormat.underlined, editor)
    },
    {
      format: EFormat.deleted,
      SvgIcon: IconStrikethrough,
      tooltip: getPlatformTooltip("strikethrough"),
      isActive: editor ? hasActiveMark(editor.value, EFormat.deleted) : false,
      onClick: () => editor && handleToggleMark(EFormat.deleted, editor)
    },
    {
      format: EFormat.code,
      SvgIcon: IconCode,
      tooltip: getPlatformTooltip("code (mod-\\)"),
      isActive: editor ? hasActiveMark(editor.value, EFormat.code) : false,
      onClick: () => editor && handleToggleMark(EFormat.code, editor)
    },
    {
      format: EFormat.superscript,
      SvgIcon: IconSuperscript,
      tooltip: getPlatformTooltip("superscript"),
      isActive: editor ? hasActiveMark(editor.value, EFormat.superscript) : false,
      onClick: () => editor && handleToggleSuperSubscript(EFormat.superscript, editor)
    },
    {
      format: EFormat.subscript,
      SvgIcon: IconSubscript,
      tooltip: getPlatformTooltip("subscript"),
      isActive: editor ? hasActiveMark(editor.value, EFormat.subscript) : false,
      onClick: () => editor && handleToggleSuperSubscript(EFormat.subscript, editor)
    },
    (() => {
      let selection: SelectionJSON | undefined;
      const fill = editor && editor.query("getActiveColor") || "#000000";
      return {
        format: EFormat.color,
        SvgIcon: InputColor,
        colors: { ...props.colors, fill },
        selectedColors: { ...props.selectedColors, fill },
        tooltip: getPlatformTooltip("color"),
        isActive: editor && editor.query("hasActiveColorMark"),
        onMouseDown: () => {
          // cache selection - interaction with platform color picker can blur
          selection = editor && editor.value.selection.toJSON();
        },
        onChange: (value: string) => {
          // restore the selection
          editor && selection && editor.select(selection);
          return editor && editor.command("setColorMark", value);
        }
      };
    })(),
    {
      format: EFormat.image,
      SvgIcon: IconImage,
      tooltip: getPlatformTooltip("image"),
      isActive: editor ? selectionContainsBlock(editor.value, EFormat.image) : false,
      onClick: () => { // editor && editor.command("addImage")
        setDialogTitle("Insert Image");
        setDialogInputs(["Enter the URL of the image:"]); 
        setDialogCommand("addImage");
        setShowDialog(true);
      }
    }, 
    {
      format: EFormat.link,
      SvgIcon: IconLink,
      tooltip: getPlatformTooltip("link"),
      isActive: editor && editor.query("isLinkActive"),
      onClick: () => editor && editor.command("toggleLink")
    },
    {
      format: EFormat.heading1,
      SvgIcon: IconHeading,
      tooltip: getPlatformTooltip("heading 1"),
      isActive: editor ? selectionContainsBlock(editor.value, EFormat.heading1) : false,
      onClick: () => editor && handleToggleBlock(EFormat.heading1, editor)
    },
    {
      format: EFormat.heading2,
      SvgIcon: IconHeading,
      iconSize: 14,
      tooltip: getPlatformTooltip("heading 2"),
      isActive: editor ? selectionContainsBlock(editor.value, EFormat.heading2) : false,
      onClick: () => editor && handleToggleBlock(EFormat.heading2, editor)
    },
    {
      format: EFormat.heading3,
      SvgIcon: IconHeading,
      iconSize: 12,
      tooltip: getPlatformTooltip("heading 3"),
      isActive: editor ? selectionContainsBlock(editor.value, EFormat.heading3) : false,
      onClick: () => editor && handleToggleBlock(EFormat.heading3, editor)
    },
    // {
    //   format: EFormat.heading4,
    //   SvgIcon: IconHeading,
    //   iconSize: 10,
    //   tooltip: getPlatformTooltip("heading 4"),
    //   isActive: editor ? hasMark(editor.value, EFormat.heading4) : false,
    //   onClick: () => editor && handleToggleBlock(EFormat.heading4, editor)
    // },
    // {
    //   format: EFormat.heading5,
    //   SvgIcon: IconHeading,
    //   iconSize: 8,
    //   tooltip: getPlatformTooltip("heading 5"),
    //   isActive: editor ? hasMark(editor.value, EFormat.heading5) : false,
    //   onClick: () => editor && handleToggleBlock(EFormat.heading5, editor)
    // },
    // {
    //   format: EFormat.heading6,
    //   SvgIcon: IconHeading,
    //   iconSize: 6,
    //   tooltip: getPlatformTooltip("heading 6"),
    //   isActive: editor ? hasMark(editor.value, EFormat.heading6) : false,
    //   onClick: () => editor && handleToggleBlock(EFormat.heading6, editor)
    // },
    {
      format: EFormat.blockQuote,
      SvgIcon: IconQuote,
      tooltip: getPlatformTooltip("block quote"),
      isActive: editor ? selectionContainsBlock(editor.value, EFormat.blockQuote) : false,
      onClick: () => editor && handleToggleBlock(EFormat.blockQuote, editor)
    },
    {
      format: EFormat.numberedList,
      SvgIcon: IconNumberedList,
      tooltip: getPlatformTooltip("numbered list"),
      isActive: editor ? selectionContainsBlock(editor.value, EFormat.numberedList) : false,
      onClick: () => editor && handleToggleListBlock(EFormat.numberedList, editor)
    },
    {
      format: EFormat.bulletedList,
      SvgIcon: IconBulletedList,
      tooltip: getPlatformTooltip("bulleted list"),
      isActive: editor ? selectionContainsBlock(editor.value, EFormat.bulletedList) : false,
      onClick: () => editor && handleToggleListBlock(EFormat.bulletedList, editor)
    },
    {
      format: EMetaFormat.fontDecrease,
      SvgIcon: IconFontDecrease,
      tooltip: getPlatformTooltip("decrease font"),
      isActive: false,
      onClick: () => editor && editor.command("decreaseFontSize")
    },
    {
      format: EMetaFormat.fontIncrease,
      SvgIcon: IconFontIncrease,
      tooltip: getPlatformTooltip("increase font"),
      isActive: false,
      onClick: () => editor && editor.command("increaseFontSize")
    }
  ];

  order && sortButtons(buttons, order);
  const handleCloseDialog = (inputFieldValues: string[] | null) => {
    setShowDialog(false);
    inputFieldValues && editor && editor.command(dialogCommand, inputFieldValues);
  }

  const dialog = props.modalPortalRoot
                  ? <ModalDialogPortal
                      modalPortalRoot={props.modalPortalRoot}
                      themeColor={props.colors?.background}
                      title={dialogTitle}
                      inputFieldStrings={dialogInputs}
                      onClose={handleCloseDialog}
                    />
                  : <ModalDialog
                      themeColor={props.colors?.background}
                      title={dialogTitle}
                      inputFieldStrings={dialogInputs}
                      onClose={handleCloseDialog}
                    />;  

  return (
    <div>
      <EditorToolbar
        className={`slate-toolbar ${props.className || ""}`}
        iconSize={16}
        buttons={buttons}
        editor={editor}
        {...others}
        />
      { showDialog && dialog}
    </div>
  );
};
