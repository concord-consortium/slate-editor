import React from "react";
import { SlateToolbar } from "./slate-toolbar";

export default {
  title: "SlateToolbar"
};

export const Horizontal = () => (
  <SlateToolbar />
);

export const Vertical = () => (
  <SlateToolbar orientation="vertical" />
);

export const Colored = () => (
  <SlateToolbar
    orientation="vertical"
    colors={{ background: "#177991", fill: "#ffffff" }}
    />
);

export const TwoColumns = () => (
  <SlateToolbar
    orientation="vertical"
    colors={{ background: "#177991", fill: "#ffffff" }}
    buttonsPerRow={9}
    />
);

export const ThreeColumns = () => (
  <SlateToolbar
    orientation="vertical"
    colors={{ background: "#177991", fill: "#ffffff" }}
    buttonsPerRow={6}
    />
);

const order = [
        "fontDecrease", "bold", "italic", "underlined", "deleted", "code", "superscript", "subscript", "color",
        "fontIncrease", "heading1", "heading2", "heading3", "block-quote", "bulleted-list", "ordered-list", "image", "link"
      ];

export const Ordered = () => (
  <SlateToolbar
    orientation="vertical"
    colors={{ background: "#177991", fill: "#ffffff" }}
    buttonsPerRow={9}
    order={order}
    />
);

const hintedOrder = order
                      // show subset of tools
                      .filter((f, i) => (i + 1) % 4 !== 0)
                      .reverse()
                      // override tooltips
                      .map(f => ({ format: f, tooltip: `hint: ${f}`}) );
export const OrderedHinted = () => (
  <SlateToolbar
    orientation="vertical"
    colors={{ background: "#177991", fill: "#ffffff" }}
    buttonsPerRow={7}
    order={hintedOrder}
    />
);
