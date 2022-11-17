import React, { ReactNode } from "react";
import { Editor } from "slate";
import { CustomRenderLeafProps, CustomText, EFormat } from "../common/slate-types";
import { useSerializing } from "../hooks/use-serializing";
import { registerMark } from "../slate-editor/leaf";

const kTextColorClass = "ccrte-text-color";

export const ColorComponent = ({ children, leaf }: CustomRenderLeafProps) => {
  const isSerializing = useSerializing();
  const { color } = leaf as CustomText;
  const baseStyle = { color };
  // color shouldn't change when text is selected
  const selectedStyle = isSerializing ? undefined : { "--selected-color": color };
  return (isSerializing ? <span style={baseStyle}>{children}</span> : 
     <span className={kTextColorClass} style={{ ...baseStyle, ...selectedStyle }}>{children}</span>);
};

export function withColorMark(editor: Editor) {
  registerMark(EFormat.color, (children: any, leaf: CustomText) => <ColorComponent leaf={leaf}>{children}</ColorComponent>);
  return editor;
};