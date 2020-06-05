import { htmlToSlate, slateToHtml } from "./html-serializer";

describe("htmlToSlate(), slateToHtml()", () => {

  it("normalizes unclosed html tags", () => {
    expect(slateToHtml(htmlToSlate("<p>"))).toBe("<p></p>");
  });

  it("can [de]serialize individual marks", () => {
    [
      "<p><strong>bold</strong></p>",
      "<p><em>italic</em></p>",
      "<p><u>underlined</u></p>",
      "<p><del>deleted</del></p>",
      "<p><code>code</code></p>",
      "<p><sup>superscript</sup></p>",
      "<p><sub>subscript</sub></p>"
    ].forEach(html => expect(slateToHtml(htmlToSlate(html))).toBe(html));
  });

  it("can [de]serialize individual blocks", () => {
    [
      "<p>paragraph</p>",
      "<h1>heading1</h1>",
      "<h2>heading2</h2>",
      "<h3>heading3</h3>",
      "<h4>heading4</h4>",
      "<h5>heading5</h5>",
      "<h6>heading6</h6>",
      "<blockquote>block-quote</blockquote>",
      "<hr/>",  // horizontal-rule
      "<ol>ordered-list</ol>",
      "<ul>bulleted-list</ul>",
      "<li>list-item</li>",
    ].forEach(html => expect(slateToHtml(htmlToSlate(html))).toBe(html));
  });

  it("can [de]serialize class and style attributes", () => {
    [
      `<p><em class="em-class">mark with class</em></p>`,
      `<p><em style="font-style:italic">mark with inline style</em></p>`,
      `<p class="foo-class bar-class">paragraph with classes</p>`,
      `<p style="float:right">paragraph with inline style</p>`,
      `<p style="float:right;text-align:center">paragraph with multiple inline styles</p>`
    ].forEach(html => expect(slateToHtml(htmlToSlate(html))).toBe(html));
  });

  it("preserves invalid inline styles", () => {
    [
      `<p style="invalid:style">paragraph with invalid inline style</p>`
    ].forEach(html => expect(slateToHtml(htmlToSlate(html))).toBe(html));
  });

  it("can [de]serialize color spans", () => {
    [
      `<p><span class="cc-text-color" style="color:#888888">color span</span></p>`
    ].forEach(html => expect(slateToHtml(htmlToSlate(html))).toBe(html));
  });

  it("can [de]serialize links", () => {
    [
      `<p><a href="https://concord.org">link</a></p>`,
      `<p><a class="my-link-class" href="https://concord.org">link with class</a></p>`
    ].forEach(html => expect(slateToHtml(htmlToSlate(html))).toBe(html));
  });

  it("can [de]serialize images", () => {
    [
      `<p><img src="https://concord.org/wp-content/themes/concord2017/images/concord-logo.svg"/></p>`,
      `<p><img class="my-image-class" src="https://concord.org/wp-content/themes/concord2017/images/concord-logo.svg"/></p>`
    ].forEach(html => expect(slateToHtml(htmlToSlate(html))).toBe(html));
  });

});
