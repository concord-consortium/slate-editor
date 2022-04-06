import { htmlToSlate, slateToHtml } from "./html-serializer";
import { normalizeHtml } from "./html-utils";
import { kFieldMouseFurColorIntro, kMonteCarloRisk, kNaturalHistoryV5Intro, kNaturalHistoryV5Page3,
          kOilAndWaterIntro } from "./lara-fixtures";
import { kLegacyBlockTags } from "../plugins/core-blocks-plugin";
import { kLegacyEmptyInlineTags, kLegacyNonEmptyInlineTags } from "../plugins/core-inlines-plugin";

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
      "<div>block</div>",
      "<p>paragraph</p>",
      "<h1>heading1</h1>",
      "<h2>heading2</h2>",
      "<h3>heading3</h3>",
      "<h4>heading4</h4>",
      "<h5>heading5</h5>",
      "<h6>heading6</h6>",
      "<blockquote>block-quote</blockquote>",
      "<hr/>",  // horizontal-rule
      "<pre>preformatted</pre>",  // preformatted
      "<ol>ordered-list</ol>",
      "<ul>bulleted-list</ul>",
      "<li>list-item</li>",
    ].forEach(html => expect(slateToHtml(htmlToSlate(html))).toBe(html));
  });

  it("can [de]serialize class and style attributes", () => {
    [
      // We no longer preserve attributes associated with mark tags
      // `<p><em class="em-class">mark with class</em></p>`,
      // `<p><em style="font-style:italic">mark with inline style</em></p>`,
      `<p class="foo-class bar-class">paragraph with classes</p>`,
      `<p style="float:right">paragraph with inline style</p>`,
      `<p style="float:right;text-align:center">paragraph with multiple inline styles</p>`
    ].forEach(html => expect(slateToHtml(htmlToSlate(html))).toBe(html));
  });

  it("converts className attribute to class", () => {
    [
      `<ul className="foo"><li className="bar"></li></ul>`
    ].forEach(html => expect(slateToHtml(htmlToSlate(html))).toBe(html.replace(/className/g, "class")));
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

  it("can [de]serialize alternate/deprecated mark formats", () => {
    [ // auto-convert alternate mark tags to current mark tags
      { in: `<p><b>bold</b></p>`, out: `<p><strong>bold</strong></p>` },
      { in: `<p><i>italic</i></p>`, out: `<p><em>italic</em></p>` },
      { in: `<p><s>strikethrough</s></p>`, out: `<p><del>strikethrough</del></p>` },
      { in: `<p><strike>strikethrough</strike></p>`, out: `<p><del>strikethrough</del></p>` }
    ].forEach(t => expect(slateToHtml(htmlToSlate(t.in))).toBe(t.out));
  });

  it("can [de]serialize alternate/deprecated block formats", () => {
    kLegacyBlockTags
      .map(tag => `<${tag} ${tag}-attr="${tag}-value">${tag}</${tag}>`)
      .forEach(html => expect(slateToHtml(htmlToSlate(html))).toBe(html));
  });

  it("strips dangerous tags", () => {
    const input = `<script script-attr="value">console.log()</script>` +
                  `<style style-attr="value">.foo { width: 100% }</style>` +
                  `<p>paragraph</p>`;
    const expected = `<p>paragraph</p>`;
    expect(slateToHtml(htmlToSlate(input))).toBe(expected);
  });

  it("ignores unsupported tags", () => {
    ["html", "link", "meta", "body", "main"]
      .map(tag => ({ in: `<${tag} ${tag}-attr="${tag}-value">${tag}</${tag}>`,
                    out: `<p>${tag}</p>` }))
      .forEach(t => expect(slateToHtml(htmlToSlate(t.in))).toBe(t.out));
  });

  it("can [de]serialize alternate/deprecated inline formats", () => {
    kLegacyNonEmptyInlineTags
      .map(tag => `<p><${tag} ${tag}-attr="${tag}-value">${tag}</${tag}></p>`)
      .forEach(html => expect(slateToHtml(htmlToSlate(html))).toBe(html));
    kLegacyEmptyInlineTags
      .map(tag => `<p><${tag} ${tag}-attr="${tag}-value"/></p>`)
      .forEach(html => expect(slateToHtml(htmlToSlate(html))).toBe(html));
  });

  it("converts <font> tags to styled <span> tags", () => {
    [
      { in: `<p><font color="#aabbcc">font color</font></p>`,
        out: `<p><span style="color:#aabbcc">font color</span></p>` },
      { in: `<p><font face="helvetica">font face</font></p>`,
        out: `<p><span style="font-family:helvetica">font face</span></p>` },
      { in: `<p><font size="1">font size</font></p>`,
        out: `<p><span style="font-size:xx-small">font size</span></p>` },
      { in: `<p><font size="3">font size</font></p>`,
        out: `<p><span style="font-size:medium">font size</span></p>` },
      { in: `<p><font size="7">font size</font></p>`,
        out: `<p><span style="font-size:xxx-large">font size</span></p>` },
      { in: `<p><font size="8">font size</font></p>`,
        out: `<p><span style="font-size:xxx-large">font size</span></p>` },
      { in: `<p><font size="-1">font size</font></p>`,
        out: `<p><span style="font-size:small">font size</span></p>` },
      { in: `<p><font size="+1">font size</font></p>`,
        out: `<p><span style="font-size:large">font size</span></p>` },
      { in: `<p><font size="+2">font size</font></p>`,
        out: `<p><span style="font-size:x-large">font size</span></p>` },
      { in: `<p><font style="text-align:center" size="4">font size</font></p>`,
        out: `<p><span style="font-size:large;text-align:center">font size</span></p>` },
    ].forEach(t => expect(slateToHtml(htmlToSlate(t.in))).toBe(t.out));
  });

  it("can [de]serialize links", () => {
    [
      `<p><a href="https://concord.org">link</a></p>`,
      `<p><a class="my-link-class" href="https://concord.org">link with class</a></p>`
    ].forEach(html => expect(slateToHtml(htmlToSlate(html))).toBe(html));
  });

  it("can [de]serialize images", () => {
    [
      `<p><img class="cc-slate-void" src="https://concord.org/wp-content/themes/concord2017/images/concord-logo.svg"/></p>`,
      `<p><img class="my-image-class cc-slate-void" src="https://concord.org/wp-content/themes/concord2017/images/concord-logo.svg"/></p>`
    ].forEach(html => expect(slateToHtml(htmlToSlate(html))).toBe(html));
  });

  it("can [de]serialize divs and spans", () => {
    [
      `<div class="my-div-class">div with class</div>`,
      `<p><span class="my-span-class">span with class</span></p>`,
    ].forEach(html => expect(slateToHtml(htmlToSlate(html))).toBe(html));
  });

  it("can [de]serialize HTML tables", () => {
    // cf. https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table
    const table1 =
            `<table>` +
              `<thead>` +
                `<tr>` +
                  `<th colspan="2">The table header</th>` +
                `</tr>` +
              `</thead>` +
              `<tbody>` +
                `<tr>` +
                  `<td>The table body</td>` +
                  `<td>with two columns</td>` +
                `</tr>` +
              `</tbody>` +
            `</table>`;
    expect(slateToHtml(htmlToSlate(table1))).toBe(table1);

    // cf. https://developer.mozilla.org/en-US/docs/Web/HTML/Element/caption
    const table2 =
            `<table>` +
              `<caption>He-Man and Skeletor facts</caption>` +
              `<tbody>` +
                `<tr>` +
                  `<td> </td>` +
                  `<th scope="col" class="heman">He-Man</th>` +
                  `<th scope="col" class="skeletor">Skeletor</th>` +
                `</tr>` +
                `<tr>` +
                  `<th scope="row">Role</th>` +
                  `<td>Hero</td>` +
                  `<td>Villain</td>` +
                `</tr>` +
                `<tr>` +
                  `<th scope="row">Weapon</th>` +
                  `<td>Power Sword</td>` +
                  `<td>Havoc Staff</td>` +
                `</tr>` +
                `<tr>` +
                  `<th scope="row">Dark secret</th>` +
                  `<td>Expert florist</td>` +
                  `<td>Cries at romcoms</td>` +
                `</tr>` +
              `</tbody>` +
            `</table>`;
    expect(slateToHtml(htmlToSlate(table2))).toBe(table2);

    // cf. https://developer.mozilla.org/en-US/docs/Web/HTML/Element/colgroup
    const table3 =
            `<table>` +
              `<caption>Superheros and sidekicks</caption>` +
              `<colgroup>` +
                `<col/>` +
                `<col span="2" class="batman"/>` +
                `<col span="2" class="flash"/>` +
              `</colgroup>` +
              `<tbody>` +
                `<tr>` +
                  `<td> </td>` +
                  `<th scope="col">Batman</th>` +
                  `<th scope="col">Robin</th>` +
                  `<th scope="col">The Flash</th>` +
                  `<th scope="col">Kid Flash</th>` +
                `</tr>` +
                `<tr>` +
                  `<th scope="row">Skill</th>` +
                  `<td>Smarts</td>` +
                  `<td>Dex, acrobat</td>` +
                  `<td>Super speed</td>` +
                  `<td>Super speed</td>` +
                `</tr>` +
              `</tbody>` +
            `</table>`;
    expect(slateToHtml(htmlToSlate(table3))).toBe(table3);

    // cf. https://html.com/tables/rowspan-colspan/
    const table4 =
            `<table>` +
              `<caption>Favorite and Least Favorite Things</caption>` +
              `<tbody>` +
                `<tr>` +
                  `<th></th><th></th>` +
                  `<th>Bob</th>` +
                  `<th>Alice</th>` +
                `</tr>` +
                `<tr>` +
                  `<th rowspan="2">Favorite</th>` +
                  `<th>Color</th>` +
                  `<td>Blue</td>` +
                  `<td>Purple</td>` +
                `</tr>` +
                `<tr>` +
                  `<th>Flavor</th>` +
                  `<td>Banana</td>` +
                  `<td>Chocolate</td>` +
                `</tr>` +
                `<tr>` +
                  `<th rowspan="2">Least Favorite</th>` +
                  `<th>Color</th>` +
                  `<td>Yellow</td>` +
                  `<td>Pink</td>` +
                `</tr>` +
                `<tr>` +
                  `<th>Flavor</th>` +
                  `<td>Mint</td>` +
                  `<td>Walnut</td>` +
                `</tr>` +
              `</tbody>` +
            `</table>`;
    expect(slateToHtml(htmlToSlate(table4))).toBe(table4);
  });

  it.skip("can [de]serialize custom authored HTML content", () => {
    expect(slateToHtml(htmlToSlate(kNaturalHistoryV5Intro))).toBe(normalizeHtml(kNaturalHistoryV5Intro));
  });

  it.skip("can [de]serialize custom authored HTML content", () => {
    expect(slateToHtml(htmlToSlate(kNaturalHistoryV5Page3))).toBe(normalizeHtml(kNaturalHistoryV5Page3));
  });

  it.skip("can [de]serialize custom authored HTML content", () => {
    expect(slateToHtml(htmlToSlate(kMonteCarloRisk))).toBe(normalizeHtml(kMonteCarloRisk));
  });

  it.skip("can [de]serialize custom authored HTML content", () => {
    expect(slateToHtml(htmlToSlate(kFieldMouseFurColorIntro))).toBe(normalizeHtml(kFieldMouseFurColorIntro));
  });

  it("can [de]serialize custom authored HTML content", () => {
    expect(slateToHtml(htmlToSlate(kOilAndWaterIntro))).toBe(normalizeHtml(kOilAndWaterIntro));
  });

});
