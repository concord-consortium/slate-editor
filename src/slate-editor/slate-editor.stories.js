import React from "react";
import { textToSlate } from "../common/slate-types";
import { SlateEditor } from "./slate-editor";

export default {
  title: "SlateEditor"
};

const initialValue = textToSlate('');
const hotkeyMap = {
                  'mod+b': 'bold',
                  'mod+i': 'italic',
                  'mod+u': 'underlined',
                  'mod+\\': 'code'
                };

function handleEditorRef() {
  // console.log("handleEditorRef");
}

export const SlateEditor1 = () => (
  <SlateEditor
    className="slate-editor"
    initialValue={initialValue}
    hotkeyMap={hotkeyMap}
    onEditorRef={handleEditorRef}
    />
);

// export const Secondary = () => <SlateEditor theme="secondary" />;
