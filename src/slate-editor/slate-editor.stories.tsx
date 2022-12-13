import React, { useMemo, useState } from "react";
import { withHistory } from "slate-history";
import { Slate, withReact } from "slate-react";
import { createEditor } from "../common/create-editor";
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
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  return (
    <Slate
    editor={editor}
    value={value}
    onChange={_value => setValue(_value)}>
    <SlateEditor
      className="slate-editor"
      value={value}
      hotkeyMap={hotkeyMap}
      readOnly={true}
      />
      </Slate>
  );
};

export const WithHistory = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const [value, setValue] = useState(initialValueWithHistory);

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={_value => setValue(_value)}>
    <SlateEditor
      className="slate-editor"
      value={value}
      />
      </Slate>
  );
};

const initialValueWithCustomHistory = textToSlate(baseValue + "including mod+ctrl+u/r for undo/redo.");
// FIXME: This story is broken
export const WithCustomHistory = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [value, setValue] = useState(initialValueWithCustomHistory);
  return (
    <Slate
      editor={editor}
      value={value}
      onChange={_value => setValue(_value)}>
      <SlateEditor
        className="slate-editor"
        hotkeyMap={hotkeyMap}
        history={{ undoHotkey: "mod+ctrl+u", redoHotkey: "mod+ctrl+r" }} // FIXME: THis doesn't work anymore
        />
      </Slate>
  );
};

const initialValueWithoutHistory = textToSlate(baseValue + "except undo/redo is disabled.");

export const WithoutHistory = () => {
  const editor = useMemo(() => withReact(createEditor({history:false})), []);
  const [value, setValue] = useState(initialValueWithoutHistory);
  return (
    <Slate
      editor={editor}
      value={value}
      onChange={_value => setValue(_value)}>
    <SlateEditor
      className="slate-editor"
      value={value}
      onChange={_value => setValue(_value)}
      hotkeyMap={hotkeyMap}
      history={false}
      />
    </Slate>
  );
};
