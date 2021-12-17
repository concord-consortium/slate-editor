import EventEmitter from "eventemitter3";
import React from "react";
import { render } from "@testing-library/react";
import { Editor } from "slate-react";
import { slateToText, textToSlate } from "../common/slate-types";
import { IProps, SlateEditor } from "./slate-editor";

describe("Slate Editor", () => {

  beforeEach(() => {
    // JSDOM doesn't support selection yet, but Slate handles a null return
    // cf. https://github.com/jsdom/jsdom/issues/317#ref-commit-30bedcf
    window.getSelection = () => null;
  });

  const renderEditor = (props: IProps) => render(<SlateEditor {...props} />);

  describe("Snapshots", () => {
    it("should open with default/empty content", () => {
      let editorRef: Editor | undefined;
      const { getByTestId } = renderEditor({
                                className: "test-class",
                                onEditorRef: (ref?: Editor) => { editorRef = ref; }
                              });

      const slateEditor = getByTestId("ccrte-editor");
      expect(slateEditor).toHaveClass("test-class");
      expect(slateToText(editorRef?.value)).toBe("");
    });

    it("should open with specified content", () => {
      let editorRef: Editor | undefined;
      const text = "Some Text!";
      const initialValue = textToSlate(text);
      const { getByTestId } = renderEditor({
                                className: "test-class-2",
                                value: initialValue,
                                onEditorRef: (ref?: Editor) => { editorRef = ref; }
                              });

      const slateEditor = getByTestId("ccrte-editor");
      expect(slateEditor).toHaveClass("test-class-2");
      expect(slateToText(editorRef?.value)).toBe(text);
    });

    it("should handle two editor instances emitting separately", () => {
      let editor1Ref: Editor | undefined;
      let editor2Ref: Editor | undefined;
      render(
        <>
          <SlateEditor className="editor-1" onEditorRef={(ref?: Editor) => { editor1Ref = ref; }} />
          <SlateEditor className="editor-2" onEditorRef={(ref?: Editor) => { editor2Ref = ref; }} />
        </>);

      expect(editor1Ref).toBeDefined();
      expect(editor2Ref).toBeDefined();
      expect(editor1Ref === editor2Ref).toBe(false);

      const emitter1: EventEmitter | undefined = editor1Ref?.query("emitter");
      const emitter2: EventEmitter | undefined = editor2Ref?.query("emitter");
      expect(emitter1).toBeDefined();
      expect(emitter2).toBeDefined();
      expect(emitter1 === emitter2).toBe(false);

      const listener1 = jest.fn();
      const listener2 = jest.fn();
      emitter1?.on("foo", listener1);
      emitter2?.on("foo", listener2);
      // editor 1 emitting "foo" should only trigger editor 1 listener
      editor1Ref?.command("emit", "foo");
      expect(listener1).toBeCalledTimes(1);
      expect(listener2).toBeCalledTimes(0);
      // editor 2 emitting "foo" should only trigger editor 2 listener
      editor2Ref?.command("emit", "foo");
      expect(listener1).toBeCalledTimes(1);
      expect(listener2).toBeCalledTimes(1);
    });

  });
});
