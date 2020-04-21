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
                                onEditorRef: (ref: Editor | undefined) => { editorRef = ref; }
                              });

      const slateEditor = getByTestId("slate-editor");
      expect(slateEditor).toHaveClass("test-class");
      expect(slateToText(editorRef?.value)).toBe("");
    });

    it("should open with specified content", () => {
      let editorRef: Editor | undefined;
      const text = "Some Text!";
      const initialValue = textToSlate(text);
      const { getByTestId } = renderEditor({
                                className: "test-class-2",
                                initialValue: initialValue,
                                onEditorRef: (ref: Editor | undefined) => { editorRef = ref; }
                              });

      const slateEditor = getByTestId("slate-editor");
      expect(slateEditor).toHaveClass("test-class-2");
      expect(slateToText(editorRef?.value)).toBe(text);
    });

  });
});
