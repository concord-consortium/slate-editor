import React from "react";
// not being picked up from `jest.setup.ts` for some reason
import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { Transforms } from "slate";
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
      <Slate editor={editor} initialValue={initialValue}>
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
            <Slate key={`editor-${i}`} editor={editor} initialValue={editorValues[i]}>
              <SlateEditor className={`editor-${i}`} />
            </Slate>
          ))}
        </div>
      );
    });

  });

  describe("Slate onChange options forwarding", () => {
    // Regression test for the SlateEditor wrapper dropping the options argument
    // when forwarding to <Slate>'s onContextChange. Without forwarding, set_selection
    // ops also trigger onValueChange (because the switch on options.operation.type
    // falls through to the default branch when options is undefined).
    it("dispatches set_selection ops to onSelectionChange, not onValueChange", async () => {
      const onValueChange = jest.fn();
      const onSelectionChange = jest.fn();
      const editor = createEditor({ history: true });
      const initialValue = textToSlate("hello");

      render(
        <Slate
          editor={editor}
          initialValue={initialValue}
          onValueChange={onValueChange}
          onSelectionChange={onSelectionChange}
        >
          <SlateEditor />
        </Slate>
      );

      onValueChange.mockClear();
      onSelectionChange.mockClear();

      await act(async () => {
        Transforms.select(editor, { path: [0, 0], offset: 1 });
        // slate batches editor.onChange onto a microtask; flush it
        await Promise.resolve();
      });

      expect(onSelectionChange).toHaveBeenCalled();
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("dispatches value ops to onValueChange", async () => {
      const onValueChange = jest.fn();
      const onSelectionChange = jest.fn();
      const editor = createEditor({ history: true });
      const initialValue = textToSlate("hello");

      render(
        <Slate
          editor={editor}
          initialValue={initialValue}
          onValueChange={onValueChange}
          onSelectionChange={onSelectionChange}
        >
          <SlateEditor />
        </Slate>
      );

      onValueChange.mockClear();
      onSelectionChange.mockClear();

      await act(async () => {
        Transforms.insertText(editor, "!", { at: { path: [0, 0], offset: 5 } });
        await Promise.resolve();
      });

      expect(onValueChange).toHaveBeenCalled();
    });
  });
});
