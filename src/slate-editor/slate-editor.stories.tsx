import React, { useMemo } from "react";
import { Slate } from "slate-react";
import { EFormat, HotkeyMap, textToSlate } from "../common/slate-types";
import { toggleMark } from "../common/slate-utils";
import { createEditor } from "../create-editor";
import { SlateEditor } from "./slate-editor";

export default {
  title: "SlateEditor"
};

const hotkeyMap: HotkeyMap = {
  'mod+b': editor => toggleMark(editor, EFormat.bold),
  'mod+i': editor => toggleMark(editor, EFormat.italic),
  'mod+u': editor => toggleMark(editor, EFormat.underlined)
};

export const ReadOnly = () => {
  const editor = useMemo(() => createEditor(), []);
  const initialValue = textToSlate("This read-only text should be selectable but not editable.");
  return (
    <Slate editor={editor} initialValue={initialValue}>
      <SlateEditor
        className="slate-editor"
        readOnly={true}
        hotkeyMap={hotkeyMap}
        />
    </Slate>
  );
};

const baseValue = "This editor-only example has no toolbar but keyboard shortcuts should work, ";
const initialValueWithoutHistory = textToSlate(baseValue);
const initialValueWithHistory = textToSlate(baseValue + "including mod+[shift]+z for undo/redo.");

export const WithoutHistory = () => {
  const editor = useMemo(() => createEditor({ history: false }), []);
  return (
    <Slate editor={editor} initialValue={initialValueWithoutHistory}>
      <SlateEditor
        className="slate-editor"
        hotkeyMap={hotkeyMap}
        />
    </Slate>
  );
};

export const WithHistory = () => {
  const editor = useMemo(() => createEditor({ history: true }), []);
  return (
    <Slate editor={editor} initialValue={initialValueWithHistory}>
      <SlateEditor
        className="slate-editor"
        hotkeyMap={hotkeyMap}
        />
    </Slate>
  );
};
