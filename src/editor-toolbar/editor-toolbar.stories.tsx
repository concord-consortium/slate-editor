import React from "react";
import IconBold from "../assets/icon-bold";
import IconCode from "../assets/icon-code";
import IconItalic from "../assets/icon-italic";
import IconBulletedList from "../assets/icon-list-bulleted";
import IconNumberedList from "../assets/icon-list-numbered";
import IconUnderline from "../assets/icon-underline";
import { EFormat } from "../common/slate-types";
import { getPlatformTooltip, IButtonSpec } from "../common/toolbar-utils";
import { EditorToolbar } from "./editor-toolbar";

import "./editor-toolbar.scss";

export default {
  title: "EditorToolbar"
};

/* eslint no-console: 0 */
const buttons: IButtonSpec[] = [
  {
    format: EFormat.bold,
    SvgIcon: IconBold,
    tooltip: getPlatformTooltip("bold (mod-b)"),
    isActive: () => false,
    onClick: () => console.log("Bold")
  },
  {
    format: EFormat.italic,
    SvgIcon: IconItalic,
    tooltip: getPlatformTooltip("italic (mod-i)"),
    isActive: () => true,
    onClick: () => console.log("Italic")
  },
  {
    format: EFormat.underlined,
    SvgIcon: IconUnderline,
    tooltip: getPlatformTooltip("underline (mod-u)"),
    isActive: () => false,
    onClick: () => console.log("Underline")
  },
  {
    format: EFormat.code,
    SvgIcon: IconCode,
    tooltip: getPlatformTooltip("code"),
    isActive: () => true,
    onClick: () => console.log("Code")
  },
  {
    format: EFormat.numberedList,
    SvgIcon: IconNumberedList,
    tooltip: getPlatformTooltip("numbered list"),
    isActive: () => false,
    onClick: () => console.log("# List")
  },
  {
    format: EFormat.bulletedList,
    SvgIcon: IconBulletedList,
    tooltip: getPlatformTooltip("bulleted list"),
    isActive: () => true,
    onClick: () => console.log("• List")
  }
];

export const Horizontal = () => (
  <EditorToolbar
    iconSize={16}
    buttons={buttons}
    />
);

export const Vertical = () => (
  <EditorToolbar
    orientation="vertical"
    iconSize={16}
    buttons={buttons}
    />
);

export const WithGap = () => {
  const _buttons = buttons.slice();
  _buttons.splice(3, 0, { format: null });
  return (
    <EditorToolbar
      iconSize={16}
      buttons={_buttons}
      />
  );
};

export const Colored = () => (
  <EditorToolbar
    orientation="vertical"
    colors={{buttonColors: { background: "#177991", fill: "#ffffff" }}}
    iconSize={16}
    buttons={buttons}
    onDidInvokeTool={format => console.log("Tool invoked:", format)}
    />
);
