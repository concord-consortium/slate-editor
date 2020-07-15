import React, { useMemo, useState }  from "react";
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
import { hasActiveMark, selectionContainsBlock, handleToggleSuperSubscript }
        from "../slate-editor/slate-utils";
import { Editor } from "slate-react";
import { SelectionJSON } from "slate";
import { EFormat, EMetaFormat, ToolFormat } from "../common/slate-types";
import { ModalDialog } from "./modal-dialog";
import { ModalDialogPortal } from "./modal-dialog-portal";

export interface IToolOrder {
  format: string;
  tooltip?: string;
}

interface IndexedToolOrder extends IToolOrder {
  index: number;
}

export type OrderEntry = string | IToolOrder;

export interface IProps extends Omit<IToolbarProps, "buttons"> {
  order?: OrderEntry[];
  modalPortalRoot?: HTMLDivElement;
  modalCoverClassName?: string;
  modalDialogClassName?: string;
  changeCount: number;
}

export interface DisplayDialogSettings {
  title: string;
  prompts: string[];
  onAccept?: (editor: Editor, inputs: string[]) => void;
}

export interface DisplayDialogFunction {
  (settings: DisplayDialogSettings): void;
}

function isToolEntryFormat(entry: OrderEntry, format: ToolFormat) {
  return typeof entry === "string"
          ? entry === format
          : entry?.format === format;
}

export const SlateToolbar: React.FC<IProps> = (props: IProps) => {
  const { className, editor, order, ...others } = props;
  const [showDialog, setShowDialog] = useState(false);
  const [dialogSettings, setDialogSettings] = useState<DisplayDialogSettings>();
  const displayDialog = (settings: DisplayDialogSettings) => {
    setDialogSettings(settings);
    // prevents focus-bouncing between editor and dialog
    editor?.blur();
    setShowDialog(true);
  };

  const buttons: IButtonSpec[] = [
    {
      format: EFormat.bold,
      SvgIcon: IconBold,
      tooltip: getPlatformTooltip("bold (mod-b)"),
      isActive: !!editor && hasActiveMark(editor.value, EFormat.bold),
      onClick: () => editor?.command("toggleMark", EFormat.bold)
    },
    {
      format: EFormat.italic,
      SvgIcon: IconItalic,
      tooltip: getPlatformTooltip("italic (mod-i)"),
      isActive: !!editor && hasActiveMark(editor.value, EFormat.italic),
      onClick: () => editor?.command("toggleMark", EFormat.italic)
    },
    {
      format: EFormat.underlined,
      SvgIcon: IconUnderline,
      tooltip: getPlatformTooltip("underline (mod-u)"),
      isActive: !!editor && hasActiveMark(editor.value, EFormat.underlined),
      onClick: () => editor?.command("toggleMark", EFormat.underlined)
    },
    {
      format: EFormat.deleted,
      SvgIcon: IconStrikethrough,
      tooltip: getPlatformTooltip("strikethrough"),
      isActive: !!editor && hasActiveMark(editor.value, EFormat.deleted),
      onClick: () => editor?.command("toggleMark", EFormat.deleted, editor)
    },
    {
      format: EFormat.code,
      SvgIcon: IconCode,
      tooltip: getPlatformTooltip("code (mod-\\)"),
      isActive: !!editor && hasActiveMark(editor.value, EFormat.code),
      onClick: () => editor?.command("toggleMark", EFormat.code, editor)
    },
    {
      format: EFormat.superscript,
      SvgIcon: IconSuperscript,
      tooltip: getPlatformTooltip("superscript"),
      isActive: !!editor && hasActiveMark(editor.value, EFormat.superscript),
      onClick: () => editor && handleToggleSuperSubscript(EFormat.superscript, editor)
    },
    {
      format: EFormat.subscript,
      SvgIcon: IconSubscript,
      tooltip: getPlatformTooltip("subscript"),
      isActive: !!editor && hasActiveMark(editor.value, EFormat.subscript),
      onClick: () => editor && handleToggleSuperSubscript(EFormat.subscript, editor)
    },
    (() => {
      let selection: SelectionJSON | undefined;
      const fill = editor && editor.query("getActiveColor") || "#000000";
      return {
        format: EFormat.color,
        SvgIcon: InputColor,
        colors: { ...props.colors?.buttonColors, fill },
        selectedColors: { ...props.colors?.selectedColors, fill },
        tooltip: getPlatformTooltip("color"),
        isActive: !!editor && editor.query("hasActiveColorMark"),
        onMouseDown: () => {
          // cache selection - interaction with platform color picker can blur
          selection = editor && editor.value.selection.toJSON();
        },
        onChange: (value: string) => {
          // restore the selection
          editor && selection && editor.select(selection);
          return editor?.command("setColorMark", value);
        }
      };
    })(),
    {
      format: EFormat.image,
      SvgIcon: IconImage,
      tooltip: getPlatformTooltip("image"),
      isActive: !!editor && editor.query("isImageActive"),
      isEnabled: !!editor && editor.query("isImageEnabled"),
      onClick: () => editor?.command("configureImage", displayDialog)
    },
    {
      format: EFormat.link,
      SvgIcon: IconLink,
      tooltip: getPlatformTooltip("link"),
      isActive: !!editor && editor.query("isLinkActive"),
      isEnabled: !!editor && editor.query("isLinkEnabled"),
      onClick: () => editor?.command("configureLink", displayDialog)
    },
    {
      format: EFormat.heading1,
      SvgIcon: IconHeading,
      tooltip: getPlatformTooltip("heading 1"),
      isActive: !!editor && selectionContainsBlock(editor.value, EFormat.heading1),
      onClick: () => editor?.command("toggleBlock", EFormat.heading1)
    },
    {
      format: EFormat.heading2,
      SvgIcon: IconHeading,
      iconSize: 14,
      tooltip: getPlatformTooltip("heading 2"),
      isActive: !!editor && selectionContainsBlock(editor.value, EFormat.heading2),
      onClick: () => editor?.command("toggleBlock", EFormat.heading2)
    },
    {
      format: EFormat.heading3,
      SvgIcon: IconHeading,
      iconSize: 12,
      tooltip: getPlatformTooltip("heading 3"),
      isActive: !!editor && selectionContainsBlock(editor.value, EFormat.heading3),
      onClick: () => editor?.command("toggleBlock", EFormat.heading3)
    },
    // {
    //   format: EFormat.heading4,
    //   SvgIcon: IconHeading,
    //   iconSize: 10,
    //   tooltip: getPlatformTooltip("heading 4"),
    //   isActive: editor ? hasMark(editor.value, EFormat.heading4) : false,
    //   onClick: () => editor?.command("toggleBlock", EFormat.heading4)
    // },
    // {
    //   format: EFormat.heading5,
    //   SvgIcon: IconHeading,
    //   iconSize: 8,
    //   tooltip: getPlatformTooltip("heading 5"),
    //   isActive: editor ? hasMark(editor.value, EFormat.heading5) : false,
    //   onClick: () => editor?.command("toggleBlock", EFormat.heading5)
    // },
    // {
    //   format: EFormat.heading6,
    //   SvgIcon: IconHeading,
    //   iconSize: 6,
    //   tooltip: getPlatformTooltip("heading 6"),
    //   isActive: editor ? hasMark(editor.value, EFormat.heading6) : false,
    //   onClick: () => editor?.command("toggleBlock", EFormat.heading6)
    // },
    {
      format: EFormat.blockQuote,
      SvgIcon: IconQuote,
      tooltip: getPlatformTooltip("block quote"),
      isActive: !!editor && selectionContainsBlock(editor.value, EFormat.blockQuote),
      onClick: () => editor?.command("toggleBlock", EFormat.blockQuote)
    },
    {
      format: EFormat.numberedList,
      SvgIcon: IconNumberedList,
      tooltip: getPlatformTooltip("numbered list"),
      isActive: !!editor && selectionContainsBlock(editor.value, EFormat.numberedList),
      onClick: () => editor?.command("toggleBlock", EFormat.numberedList)
    },
    {
      format: EFormat.bulletedList,
      SvgIcon: IconBulletedList,
      tooltip: getPlatformTooltip("bulleted list"),
      isActive: !!editor && selectionContainsBlock(editor.value, EFormat.bulletedList),
      onClick: () => editor?.command("toggleBlock", EFormat.bulletedList)
    },
    {
      format: EMetaFormat.fontDecrease,
      SvgIcon: IconFontDecrease,
      tooltip: getPlatformTooltip("decrease font"),
      isActive: false,
      onClick: () => editor?.command("decreaseFontSize")
    },
    {
      format: EMetaFormat.fontIncrease,
      SvgIcon: IconFontIncrease,
      tooltip: getPlatformTooltip("increase font"),
      isActive: false,
      onClick: () => editor?.command("increaseFontSize")
    }
  ];

  const _buttons = useMemo(() => {
    if (!order) return buttons;
    const orderMap: Record<string, IndexedToolOrder> = {};
    order.forEach((entry, index) => {
            // normalize entries and add index
            const mapEntry = typeof entry === "string"
                              ? { format: entry, index: index + 1 }
                              : { ...entry, index: index + 1 };
            orderMap[mapEntry.format] = mapEntry;
          });
    const b = buttons
                // make a copy of the array
                .slice()
                // filter out the unspecified buttons
                .filter(button => order.find(entry => isToolEntryFormat(entry, button.format)))
                // use client-provided tooltip overrides
                .map(button => {
                  const hint = orderMap[button.format].tooltip;
                  const tooltip = hint ? { tooltip: getPlatformTooltip(hint) } : {};
                  return { ...button, ...tooltip };
                });
    b.sort((button1, button2) => orderMap[button1.format].index - orderMap[button2.format].index);
    return b;
  }, [buttons, order]);

  const handleCloseDialog = (inputs: string[] | null) => {
    setShowDialog(false);
    editor && inputs && dialogSettings?.onAccept?.(editor, inputs);
  };

  const themeColor = props.colors?.themeColor || props.colors?.buttonColors?.background;
  const dialog = showDialog && dialogSettings
                  ? (props.modalPortalRoot
                      ? <ModalDialogPortal
                          modalPortalRoot={props.modalPortalRoot}
                          coverClassName={props.modalCoverClassName}
                          dialogClassName={props.modalDialogClassName}
                          themeColor={themeColor}
                          title={dialogSettings.title}
                          prompts={dialogSettings.prompts}
                          onClose={handleCloseDialog}
                        />
                      : <ModalDialog
                          coverClassName={props.modalCoverClassName}
                          dialogClassName={props.modalDialogClassName}
                          themeColor={themeColor}
                          title={dialogSettings.title}
                          prompts={dialogSettings.prompts}
                          onClose={handleCloseDialog}
                        />)
                  : null;

  return (
    <div>
      <EditorToolbar
        className={`slate-toolbar ${props.className || ""}`}
        iconSize={16}
        buttons={_buttons}
        editor={editor}
        {...others}
        />
      {dialog}
    </div>
  );
};
