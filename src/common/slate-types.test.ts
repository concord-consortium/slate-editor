import { EFormat, textToSlate, slateToText } from "./slate-types";

// FIXME: what should these tests be replaced with? isMarkActive?
// describe("Slate Editor types", () => {

//   it("can each be classified as a mark, inline, or block", () => {
//     const typesArray = Object.values(EFormat);
//     typesArray.forEach(format => {
//       const isMark = isMarkFormat(format) ? 1 : 0;
//       const isInline = isInlineFormat(format) ? 1 : 0;
//       const isBlock = isBlockFormat(format) ? 1 : 0;
//       expect(`${format}: ${isMark + isInline + isBlock}`).toBe(`${format}: 1`);
//     });
// });
//   it("doesn't classify invalid formats", () => {
//     const format = "foo" as EFormat;
//     const isMark = isMarkFormat(format) ? 1 : 0;
//     const isInline = isInlineFormat(format) ? 1 : 0;
//     const isBlock = isBlockFormat(format) ? 1 : 0;
//     expect(isMark + isInline + isBlock).toBe(0);
//   });

// });

describe("slateToText(), textToSlate()", () => {

    it("can serialize the empty string", () => {
      expect(slateToText()).toEqual("");
    });

  it("slateToText() <=> textToSlate()", () => {
    const inText = "Some text!";
    const value = textToSlate(inText);
    const outText = slateToText(value);
    expect(outText).toEqual(outText);
  });
});
