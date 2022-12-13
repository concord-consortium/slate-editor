import { convertDocument, convertElement, convertMark, convertNode, convertTextNode } from "./slate-json-conversion";

// FIXME: Should these all be typed? 
describe("Slate 47 to 50+ json conversion", () => {
  const boldMark = { type: "bold" };
  const colorValue = "#aabbcc";
  const colorMark = { type: "color", data: { color: colorValue } };
  const blockNode = { object: "block", type: "my-block",
                                nodes: [{ object: "text", text: "" }] };
  const block050 = { type: "my-block", children: [{ text: "" }] };
  const nodeData = { nodeKey: "nodeValue" };
  const inlineNode =  { object: "inline", type: "my-inline",
                                  nodes: [{ object: "text", text: "" }],
                                  key: "my-key", data: nodeData };
  const inline050 = { type: "my-inline", children: [{ text: "" }],
                      key: "my-key", nodeKey: "nodeValue" };
  const emptyTextNode = { object: "text", text: "" };
  const emptyText050 = { text: "" };
  const textNode = { object: "text", text: "foo", marks: [boldMark] };
  const text050 = { text: "foo", bold: true };
  
  it("can convert marks", () => {
    expect(convertMark(boldMark)).toBe(true);

    expect(convertMark(colorMark)).toBe(colorValue);

    const nestedValue = { key: "value" };
    const nestedMark = { type: "nested", data: nestedValue };
    expect(convertMark(nestedMark)).toEqual(nestedValue);
  });

  it("can convert text nodes", () => {
    // empty text node
    expect(convertTextNode(emptyTextNode)).toEqual(emptyText050);

    // text node with text and marks
    expect(convertTextNode(textNode)).toEqual(text050);
  });

  it("can convert blocks/inlines", () => {
    // block
    const objTypes = {};
    expect(convertElement(blockNode, objTypes)).toEqual(block050);
    expect(objTypes).toEqual({ "my-block": "block" });

    // inline
    expect(convertElement(inlineNode, objTypes)).toEqual(inline050);
    expect(objTypes).toEqual({ "my-block": "block", "my-inline": "inline" });

    // untyped blocks default to paragraphs
    const untypedTextJSON = { text: "foo" };
    const untypedParagraphJSON = { nodes: [untypedTextJSON] };
    const untypedText050 = { text: "foo" };
    const untypedParagraph050 = { children: [untypedText050] };
    expect(convertNode(untypedParagraphJSON, objTypes)).toEqual(untypedParagraph050);
  });

  it("can convert documents", () => {
    const document =  { object: "document",
                                    nodes: [blockNode, inlineNode, textNode] };
    const serializedDocument = convertDocument(document);
    const doc050 = { children: [block050, inline050, text050],
                    objTypes: { "my-block": "block", "my-inline": "inline" } };
    expect(serializedDocument).toEqual(doc050);
  });
 
  it("can convert the richtext example", () => {
    const richText047 = {
            "object": "document",
            "nodes": [
              {
                "object": "block",
                "type": "paragraph",
                "nodes": [
                  {
                    "object": "text",
                    "text": "This is editable "
                  },
                  {
                    "object": "text",
                    "text": "rich",
                    "marks": [{ "type": "bold" }]
                  },
                  {
                    "object": "text",
                    "text": " text, "
                  },
                  {
                    "object": "text",
                    "text": "much",
                    "marks": [{ "type": "italic" }]
                  },
                  {
                    "object": "text",
                    "text": " better than a "
                  },
                  {
                    "object": "text",
                    "text": "<textarea>",
                    "marks": [{ "type": "code" }]
                  },
                  {
                    "object": "text",
                    "text": "!"
                  }
                ]
              },
              {
                "object": "block",
                "type": "paragraph",
                "nodes": [
                  {
                    "object": "text",
                    "text":
                      "Since it's rich text, you can do things like turn a selection of text "
                  },
                  {
                    "object": "text",
                    "text": "bold",
                    "marks": [{ "type": "bold" }]
                  },
                  {
                    "object": "text",
                    "text":
                      ", or add a semantically rendered block quote in the middle of the page, like this:"
                  }
                ]
              },
              {
                "object": "block",
                "type": "block-quote",
                "nodes": [
                  {
                    "object": "text",
                    "text": "A wise quote."
                  }
                ]
              },
              {
                "object": "block",
                "type": "paragraph",
                "nodes": [
                  {
                    "object": "text",
                    "text": "Try it out for yourself!"
                  }
                ]
              }
            ]
          };
    const richText050 = [
            {
              type: 'paragraph',
              children: [
                { text: 'This is editable ' },
                { text: 'rich', bold: true },
                { text: ' text, ' },
                { text: 'much', italic: true },
                { text: ' better than a ' },
                { text: '<textarea>', code: true },
                { text: '!' },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  text:
                    "Since it's rich text, you can do things like turn a selection of text ",
                },
                { text: 'bold', bold: true },
                {
                  text:
                    ', or add a semantically rendered block quote in the middle of the page, like this:',
                },
              ],
            },
            {
              type: 'block-quote',
              children: [{ text: 'A wise quote.' }],
            },
            {
              type: 'paragraph',
              children: [{ text: 'Try it out for yourself!' }],
            },
          ];
    const converted = convertDocument(richText047);
    expect(converted.children).toEqual(richText050);
  });

  it("can convert the links example", () => {
    const links047 = {
            "object": "document",
            "nodes": [
              {
                "object": "block",
                "type": "paragraph",
                "nodes": [
                  {
                    "object": "text",
                    "text":
                      "In addition to block nodes, you can create inline nodes, like "
                  },
                  {
                    "object": "inline",
                    "type": "link",
                    "data": {
                      "url": "https://en.wikipedia.org/wiki/Hypertext"
                    },
                    "nodes": [
                      {
                        "object": "text",
                        "text": "hyperlinks"
                      }
                    ]
                  },
                  {
                    "object": "text",
                    "text": "!"
                  }
                ]
              },
              {
                "object": "block",
                "type": "paragraph",
                "nodes": [
                  {
                    "object": "text",
                    "text":
                      "This example shows hyperlinks in action. It features two ways to add links. You can either add a link via the toolbar icon above, or if you want in on a little secret, copy a URL to your keyboard and paste it while a range of text is selected."
                  }
                ]
              }
            ]
          };
    const links050 = [
            {
              type: "paragraph",
              children: [
                {
                  text: 'In addition to block nodes, you can create inline nodes, like ',
                },
                {
                  type: 'link',
                  url: 'https://en.wikipedia.org/wiki/Hypertext',
                  children: [{ text: 'hyperlinks' }],
                },
                {
                  text: '!',
                },
              ],
            },
            {
              type: "paragraph",
              children: [
                {
                  text:
                    'This example shows hyperlinks in action. It features two ways to add links. You can either add a link via the toolbar icon above, or if you want in on a little secret, copy a URL to your keyboard and paste it while a range of text is selected.',
                }
              ],
            },
          ];
    const converted = convertDocument(links047);
    expect(converted.children).toEqual(links050);
  });
});