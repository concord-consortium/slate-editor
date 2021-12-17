import React, { useState } from "react";
import { HotkeyMap } from "../common/slate-hooks";
import { EFormat, textToSlate } from "../common/slate-types";
import { SlateEditor } from "./slate-editor";

export default {
  title: "SlateEditor"
};

const hotkeyMap: HotkeyMap = {
        'mod+b': editor => editor.toggleMark(EFormat.bold),
        'mod+i': editor => editor.toggleMark(EFormat.italic),
        'mod+u': editor => editor.toggleMark(EFormat.underlined)
      };

const baseValue = "This editor-only example has no toolbar but keyboard shortcuts should work, ";
const initialValueWithHistory = textToSlate(baseValue + "including mod+[shift]+z for undo/redo.");

export const ReadOnly = () => {
  const [value, setValue] = useState(textToSlate("This read-only text should be selectable but not editable."));
  return (
    <SlateEditor
      className="slate-editor"
      readOnly={true}
      value={value}
      onValueChange={_value => setValue(_value)}
      hotkeyMap={hotkeyMap}
      />
  );
};

export const WithHistory = () => {
  const [value, setValue] = useState(initialValueWithHistory);
  return (
    <SlateEditor
      className="slate-editor"
      value={value}
      onValueChange={_value => setValue(_value)}
      hotkeyMap={hotkeyMap}
      />
  );
};

const initialValueWithCustomHistory = textToSlate(baseValue + "including mod+ctrl+u/r for undo/redo.");

export const WithCustomHistory = () => {
  const [value, setValue] = useState(initialValueWithCustomHistory);
  return (
    <SlateEditor
      className="slate-editor"
      value={value}
      onValueChange={_value => setValue(_value)}
      hotkeyMap={hotkeyMap}
      history={{ undoHotkey: "mod+ctrl+u", redoHotkey: "mod+ctrl+r" }}
      />
  );
};

const initialValueWithoutHistory = textToSlate(baseValue + "except undo/redo is disabled.");

export const WithoutHistory = () => {
  const [value, setValue] = useState(initialValueWithoutHistory);
  return (
    <SlateEditor
      className="slate-editor"
      value={value}
      onValueChange={_value => setValue(_value)}
      hotkeyMap={hotkeyMap}
      history={false}
      />
  );
};
