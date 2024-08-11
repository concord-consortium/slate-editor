import React from "react";
import { Editor } from "slate";
import { CustomMarks, CustomRenderLeafProps, CustomText } from "../common/custom-types";
import { EFormat } from "../common/slate-types";
import { ButtonSpecColorFn, getPlatformTooltip, registerToolbarButtons } from "../common/toolbar-utils";
import { useSerializing } from "../hooks/use-serializing";
import { registerMarkRenderer } from "../slate-editor/leaf";
import { registerMarkDeserializer } from "../serialization/html-serializer";
import { toHexIfColor } from "../serialization/html-utils";
import InputColor from "./input-color";

const kTextColorClass = "ccrte-text-color";

export const ColorComponent = ({ children, leaf }: CustomRenderLeafProps) => {
  const isSerializing = useSerializing();
  const { color } = leaf;
  const baseStyle = { color };
  // color shouldn't change when text is selected
  const selectedStyle = isSerializing ? undefined : { "--selected-color": color };
  return <span className={kTextColorClass} style={{ ...baseStyle, ...selectedStyle }}>{children}</span>;
};

let isRegistered = false;

// should be registered after other marks so color wraps the others
export function registerColorMark() {
  if (isRegistered) return;

  registerMarkRenderer((children: any, leaf: CustomText) => {
    return leaf[EFormat.color]
            ? <ColorComponent leaf={leaf}>{children}</ColorComponent>
            : children;
  });

  registerMarkDeserializer("span", {
    test: (el: HTMLElement) => {
      return el.nodeName.toLowerCase() === "span" && el.classList.contains(kTextColorClass);
    },
    deserialize: (el: HTMLElement, marks: CustomMarks) => marks.color = toHexIfColor(el.style.color)
  });

  isRegistered = true;
}

export function withColorMark(editor: Editor) {
  registerColorMark();

  registerToolbarButtons(editor, [
    (() => {
      const setFillColor: ButtonSpecColorFn = colors => {
        const fill = (Editor.marks(editor) as CustomMarks)?.color || "#000000";
        return { ...colors, fill };
      };
      return {
        format: EFormat.color,
        SvgIcon: InputColor,
        colors: setFillColor,
        selectedColors: setFillColor,
        tooltip: getPlatformTooltip("color"),
        isActive: () => !!(Editor.marks(editor) as CustomMarks)?.color,
        onChange: (value: string) => {
          return editor?.addMark(EFormat.color, value);
        }
      };
    })()
  ]);

  return editor;
}
