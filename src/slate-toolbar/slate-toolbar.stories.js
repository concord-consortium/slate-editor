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

export const Ordered = () => (
  <SlateToolbar
    orientation="vertical"
    colors={{ background: "#177991", fill: "#ffffff" }}
    buttonsPerRow={9}
    order={["fontDecrease", "bold", "italic", "underlined", "deleted", "code", "superscript", "subscript", "color",
            "fontIncrease"]}
    />
);
