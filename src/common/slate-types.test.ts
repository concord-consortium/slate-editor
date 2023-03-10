import { textToSlate, slateToText } from "./slate-types";

describe("slateToText(), textToSlate()", () => {

  it("can serialize the empty string", () => {
    expect(slateToText()).toEqual("");
  });

  it("slateToText() <=> textToSlate(): single line", () => {
    const inText = "A single line of text!";
    const value = textToSlate(inText);
    const outText = slateToText(value);
    expect(outText).toEqual(outText);
  });

  it("slateToText() <=> textToSlate(): multiple lines", () => {
    const inText = "Multiple lines\nof text!";
    const value = textToSlate(inText);
    const outText = slateToText(value);
    expect(outText).toEqual(outText);
  });
});
