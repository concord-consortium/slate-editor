import React, { useState } from "react";
import { EFormat, textToSlate } from "../common/slate-types";
import { SlateEditor } from "./slate-editor";

export default {
  title: "SlateEditor"
};

const initialValue = textToSlate("This editor-only example has no toolbar but keyboard shortcuts should work.");
const hotkeyMap = {
        'mod+b': editor => editor.toggleMark(EFormat.bold),
        'mod+i': editor => editor.toggleMark(EFormat.italic),
        'mod+u': editor => editor.toggleMark(EFormat.underlined),
        'mod+\\': editor => editor.toggleMark(EFormat.code),
      };

function handleEditorRef() {
  // console.log("handleEditorRef");
}

export const SlateEditor1 = () => {
  const [value, setValue] = useState(initialValue);
  return (
    <SlateEditor
      className="slate-editor"
      value={value}
      onValueChange={_value => setValue(_value)}
      hotkeyMap={hotkeyMap}
      onEditorRef={handleEditorRef}
      />
  );
};

// export const Secondary = () => <SlateEditor theme="secondary" />;
