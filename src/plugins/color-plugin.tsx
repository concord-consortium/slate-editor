import React from "react";
import { Editor } from "slate";
import { CustomMarks, CustomRenderLeafProps, CustomText } from "../common/custom-types";
import { useSerializing } from "../hooks/use-serializing";
import { EFormat } from "../common/slate-types";
import { registerMarkRenderer } from "../slate-editor/leaf";
import { registerMarkDeserializer } from "../serialization/html-serializer";
import { toHexIfColor } from "../serialization/html-utils";

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
  return editor;
}
