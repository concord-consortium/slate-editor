import React from "react";
// not being picked up from `jest.setup.ts` for some reason
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Slate } from "slate-react";
import { EditorValue, slateToText, textToSlate } from "../common/slate-types";
import { IProps as ISlateEditorProps, SlateEditor } from "./slate-editor";
import { createEditor } from "../create-editor";

describe("Slate Editor", () => {

  beforeEach(() => {
    // JSDOM doesn't support selection yet, but Slate handles a null return
    // cf. https://github.com/jsdom/jsdom/issues/317#ref-commit-30bedcf
    window.getSelection = () => null;
  });

  interface IRenderEditorProps extends ISlateEditorProps {
    initialValue?: EditorValue;
  }
  const renderEditor = (props: IRenderEditorProps) => {
    const { initialValue = [], ...editorProps } = props;
    const editor = createEditor({ history: true });
    const renderResult = render(
      <Slate editor={editor} value={initialValue}>
        <SlateEditor {...editorProps} />
      </Slate>
    );
    return { ...renderResult, editor };
  };

  describe("Snapshots", () => {
    it("should open with default/empty content", () => {
      const { getByTestId } = screen;
      const { editor } = renderEditor({ className: "test-class" });

      const slateEditor = getByTestId("ccrte-editor");
      expect(slateEditor).toHaveClass("test-class");
      expect(slateToText(editor.children)).toBe("");
    });

    it("should open with specified content", () => {
      const { getByTestId } = screen;

      const text = "Some Text!";
      const initialValue = textToSlate(text);
      const { editor } = renderEditor({ className: "test-class-2", initialValue });

      const slateEditor = getByTestId("ccrte-editor");
      expect(slateEditor).toHaveClass("test-class-2");
      expect(slateToText(editor.children)).toBe(text);
    });

    it("should handle two editor instances emitting separately", () => {
      const editors = [createEditor({ history: true }), createEditor({ history: true })];
      const editorValues = [textToSlate("Editor 1"), textToSlate("Editor 2")];
      render(
        <div>
          {editors.map((editor, i) => (
            <Slate key={`editor-${i}`} editor={editor} value={editorValues[i]}>
              <SlateEditor className={`editor-${i}`} />
            </Slate>
          ))}
        </div>
      );

      const listeners = [jest.fn(), jest.fn()];
      editors.forEach((editor, i) => editor.onEvent("foo", listeners[i]));
      // editor 1 emitting "foo" should only trigger editor 1 listener
      editors[0].emitEvent("foo");
      expect(listeners[0]).toBeCalledTimes(1);
      expect(listeners[1]).toBeCalledTimes(0);
      // editor 2 emitting "foo" should only trigger editor 2 listener
      editors[1].emitEvent("foo");
      expect(listeners[0]).toBeCalledTimes(1);
      expect(listeners[1]).toBeCalledTimes(1);
    });

  });
});
