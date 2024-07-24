import React, { useCallback, useMemo } from "react";
import { Slate, withReact } from "slate-react";
import { createEditor } from "../create-editor";
import { IButtonSpec } from "../editor-toolbar/editor-toolbar";
import { SlateToolbar, ToolbarTransform } from "./slate-toolbar";

export default {
  title: "SlateToolbar"
};

export const Horizontal = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  return (
    <Slate editor={editor} initialValue={[]}>
      <SlateToolbar />
    </Slate>
  );
};

export const Vertical = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  return (
    <Slate editor={editor} initialValue={[]}>
      <SlateToolbar orientation="vertical" />
    </Slate>
  );
};

export const Colored = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  return (
    <Slate editor={editor} initialValue={[]}>
      <SlateToolbar orientation="vertical"
        colors={{ buttonColors: { background: "#177991", fill: "#ffffff" } }} />
    </Slate>
  );
};

export const TwoColumns = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  return (
    <Slate editor={editor} initialValue={[]}>
      <SlateToolbar orientation="vertical" buttonsPerRow={9}
        colors={{ buttonColors: { background: "#177991", fill: "#ffffff" } }} />
    </Slate>
  );
};

export const ThreeColumns = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  return (
    <Slate editor={editor} initialValue={[]}>
      <SlateToolbar orientation="vertical" buttonsPerRow={6}
        colors={{ buttonColors: { background: "#177991", fill: "#ffffff" } }} />
    </Slate>
  );
};

const order = [
        "fontDecrease", "bold", "italic", "underlined", "deleted", "code", "superscript", "subscript", "color",
        "fontIncrease", "heading1", "heading2", "heading3", "block-quote", "bulleted-list", "ordered-list", "image", "link"
      ];

export const Ordered = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const transform = useCallback<ToolbarTransform>(buttons => {
    return order
            .map(format => buttons.find(b => b.format === format))
            .filter(b => !!b) as IButtonSpec[];
  }, []);
  return (
    <Slate editor={editor} initialValue={[]}>
      <SlateToolbar orientation="vertical" buttonsPerRow={9} transform={transform}
        colors={{ buttonColors: { background: "#177991", fill: "#ffffff" } }} />
    </Slate>
  );
};

export const OrderedHinted = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const transform = useCallback<ToolbarTransform>(buttons => {
    return order
            // show subset of tools
            .filter((f, i) => (i + 1) % 4 !== 0)
            .reverse()
            .map(format => buttons.find(b => b.format === format))
            // override tooltips
            .map(b => {
              const { tooltip, ...others } = b || {};
              return { ...others, tooltip: tooltip ? `hint: ${tooltip}` : tooltip };
            })
            .filter(b => !!b?.format) as IButtonSpec[];
  }, []);
  return (
    <Slate editor={editor} initialValue={[]}>
      <SlateToolbar orientation="vertical" buttonsPerRow={7} transform={transform}
        colors={{ buttonColors: { background: "#177991", fill: "#ffffff" } }} />
    </Slate>
  );
};
