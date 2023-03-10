import React from "react";
import { RichTextExample } from "./rich-text-example";

export default {
  title: "RichTextExample"
};

export const ReadOnly = () => {
  return <RichTextExample readOnly={true} />;
};

export const Editable = () => {
  return <RichTextExample />;
};
