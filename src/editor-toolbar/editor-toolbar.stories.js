import React from "react";
import { EditorToolbar, getPlatformTooltip } from "./editor-toolbar";
import IconBold from "../assets/icon-bold";
import IconCode from "../assets/icon-code";
import IconItalic from "../assets/icon-italic";
import IconBulletedList from "../assets/icon-list-bulleted";
import IconNumberedList from "../assets/icon-list-numbered";
import IconUnderline from "../assets/icon-underline";
import "./editor-toolbar.scss";

export default {
  title: "EditorToolbar"
};

/* eslint no-console: 0 */
const buttons = [
  {
    format: "bold",
    SvgIcon: IconBold,
    tooltip: getPlatformTooltip("bold (mod-b)"),
    onIsActive: () => true,
    onClick: () => console.log("Bold")
  },
  {
    format: "italic",
    SvgIcon: IconItalic,
    tooltip: getPlatformTooltip("italic (mod-i)"),
    onIsActive: () => true,
    onClick: () => console.log("Italic")
  },
  {
    format: "underlined",
    SvgIcon: IconUnderline,
    tooltip: getPlatformTooltip("underline (mod-u)"),
    onIsActive: () => true,
    onClick: () => console.log("Underline")
  },
  {
    format: "code",
    SvgIcon: IconCode,
    tooltip: getPlatformTooltip("code"),
    onIsActive: () => true,
    onClick: () => console.log("Code")
  },
  {
    format: "ordered-list",
    SvgIcon: IconNumberedList,
    tooltip: getPlatformTooltip("numbered list"),
    onClick: () => console.log("# List")
  },
  {
    format: "bulleted-list",
    SvgIcon: IconBulletedList,
    tooltip: getPlatformTooltip("bulleted list"),
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

export const Colored = () => (
  <EditorToolbar
    orientation="vertical"
    colors={{ background: "#177991", fill: "#ffffff" }}
    iconSize={16}
    buttons={buttons}
    />
);
