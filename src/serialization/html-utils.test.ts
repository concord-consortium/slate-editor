import { mergeClassStrings, toReactStyle } from "./html-utils";

describe("HTML utility functions", () => {

  describe("toReactStyle", () => {
    it("returns undefined if there are no properties", () => {
      expect(toReactStyle("")).toBeUndefined();
    });
    it("camelizes property names", () => {
      expect(toReactStyle("background-color:white")).toEqual({ backgroundColor: "white" });
    });
    it("handles custom CSS properties without camelizing", () => {
      expect(toReactStyle("--my-custom-color:white")).toEqual({ "--my-custom-color": "white" });
    });
  });

  it("mergeClassStrings works as expected", () => {
    expect(mergeClassStrings()).toBeUndefined();
    expect(mergeClassStrings("", "")).toBeUndefined();
    expect(mergeClassStrings("foo")).toBe("foo");
    expect(mergeClassStrings("", "foo")).toBe("foo");
    expect(mergeClassStrings("foo", "bar")).toBe("foo bar");
    expect(mergeClassStrings("foo bar", "bar foo baz")).toBe("foo bar baz");
  });
});
