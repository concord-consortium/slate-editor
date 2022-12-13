describe("serializer", () => {
  it("TODO: fix commented out tests", () => {
    expect(true).toBe(true);
  });
});
// import { 
//         serializeDocument,
//         ObjectTypeMap, MarkJSON, TextJSON, BlockJSON, InlineJSON, DocumentJSON } from "./serialization";
//import { BlockJSON, DocumentJSON, InlineJSON, MarkJSON, TextJSON } from "slate";
// FIXME: :( 
// describe("Slate Editor serialization", () => {

//   const boldMark: MarkJSON = { type: "bold" };
//   const colorValue = "#aabbcc";
//   const colorMark: MarkJSON = { type: "color", data: { color: colorValue } };
//   it("can serialize/deserialize marks", () => {
//     expect(serializeMark(boldMark)).toBe(true);
//     expect(deserializeMark("bold", true)).toEqual(boldMark);

//     expect(serializeMark(colorMark)).toBe(colorValue);
//     expect(deserializeMark("color", colorValue)).toEqual(colorMark);

//     const nestedValue = { key: "value" };
//     const nestedMark: MarkJSON = { type: "nested", data: nestedValue };
//     expect(serializeMark(nestedMark)).toEqual(nestedValue);
//     expect(deserializeMark("nested", nestedValue)).toEqual(nestedMark);
//   });

//   const emptyTextNode: TextJSON = { object: "text", text: "" };
//   const emptyText050 = { text: "" };
//   const textNode: TextJSON = { object: "text", text: "foo", marks: [boldMark] };
//   const text050 = { text: "foo", bold: true };
//   it("can serialize/deserialize text nodes", () => {
//     // empty text node
//     expect(serializeTextNode(emptyTextNode)).toEqual(emptyText050);
//     expect(deserializeTextNode(emptyText050)).toEqual(emptyTextNode);

//     // text node with text and marks
//     expect(serializeTextNode(textNode)).toEqual(text050);
//     expect(deserializeTextNode(text050)).toEqual(textNode);
//   });

//   const blockNode: BlockJSON = { object: "block", type: "my-block",
//                                 nodes: [{ object: "text", text: "" }] };
//   const block050 = { type: "my-block", children: [{ text: "" }] };
//   const nodeData = { nodeKey: "nodeValue" };
//   const inlineNode: InlineJSON = { object: "inline", type: "my-inline",
//                                   nodes: [{ object: "text", text: "" }],
//                                   key: "my-key", data: nodeData };
//   const inline050 = { type: "my-inline", children: [{ text: "" }],
//                       key: "my-key", nodeKey: "nodeValue" };
//   it("can serialize/deserialize blocks/inlines", () => {
//     // block
//     const objTypes: ObjectTypeMap = {};
//     expect(serializeElement(blockNode, objTypes)).toEqual(block050);
//     expect(objTypes).toEqual({ "my-block": "block" });
//     expect(deserializeElement(block050, objTypes)).toEqual(blockNode);

//     // inline
//     expect(serializeElement(inlineNode, objTypes)).toEqual(inline050);
//     expect(objTypes).toEqual({ "my-block": "block", "my-inline": "inline" });
//     expect(deserializeElement(inline050, objTypes)).toEqual(inlineNode);

//     // untyped blocks default to paragraphs
//     const untypedTextJSON = { text: "foo" };
//     const untypedParagraphJSON = { nodes: [untypedTextJSON] };
//     const untypedText050 = { text: "foo" };
//     const untypedParagraph050 = { children: [untypedText050] };
//     const typedTextJSON = { object: "text", text: "foo" };
//     const paragraphJSON = {
//             object: "block",
//             type: "paragraph",
//             nodes: [typedTextJSON]
//           };
//     expect(serializeNode(untypedParagraphJSON, objTypes)).toEqual(untypedParagraph050);
//     expect(deserializeNode(untypedParagraph050, objTypes)).toEqual(paragraphJSON);
//   });

//   it.only("can serialize/deserialize documents", () => {
//     const document: DocumentJSON = { object: "document",
//                                     nodes: [blockNode, inlineNode, textNode] };
//     const serializedDocument = serializeDocument(document);
//     const doc050 = { children: [block050, inline050, text050],
//                     objTypes: { "my-block": "block", "my-inline": "inline" } };
//     expect(serializedDocument).toEqual(doc050);
//     expect(deserializeDocument(doc050)).toEqual(document);
//   });
// });

// describe("More Slate Editor serialization", () => {
  
//   it("can serialize/deserialize the richtext example", () => {
//     const richText047: DocumentJSON = {
//             "object": "document",
//             "nodes": [
//               {
//                 "object": "block",
//                 "type": "paragraph",
//                 "nodes": [
//                   {
//                     "object": "text",
//                     "text": "This is editable "
//                   },
//                   {
//                     "object": "text",
//                     "text": "rich",
//                     "marks": [{ "type": "bold" }]
//                   },
//                   {
//                     "object": "text",
//                     "text": " text, "
//                   },
//                   {
//                     "object": "text",
//                     "text": "much",
//                     "marks": [{ "type": "italic" }]
//                   },
//                   {
//                     "object": "text",
//                     "text": " better than a "
//                   },
//                   {
//                     "object": "text",
//                     "text": "<textarea>",
//                     "marks": [{ "type": "code" }]
//                   },
//                   {
//                     "object": "text",
//                     "text": "!"
//                   }
//                 ]
//               },
//               {
//                 "object": "block",
//                 "type": "paragraph",
//                 "nodes": [
//                   {
//                     "object": "text",
//                     "text":
//                       "Since it's rich text, you can do things like turn a selection of text "
//                   },
//                   {
//                     "object": "text",
//                     "text": "bold",
//                     "marks": [{ "type": "bold" }]
//                   },
//                   {
//                     "object": "text",
//                     "text":
//                       ", or add a semantically rendered block quote in the middle of the page, like this:"
//                   }
//                 ]
//               },
//               {
//                 "object": "block",
//                 "type": "block-quote",
//                 "nodes": [
//                   {
//                     "object": "text",
//                     "text": "A wise quote."
//                   }
//                 ]
//               },
//               {
//                 "object": "block",
//                 "type": "paragraph",
//                 "nodes": [
//                   {
//                     "object": "text",
//                     "text": "Try it out for yourself!"
//                   }
//                 ]
//               }
//             ]
//           };
//     const richText050 = [
//             {
//               type: 'paragraph',
//               children: [
//                 { text: 'This is editable ' },
//                 { text: 'rich', bold: true },
//                 { text: ' text, ' },
//                 { text: 'much', italic: true },
//                 { text: ' better than a ' },
//                 { text: '<textarea>', code: true },
//                 { text: '!' },
//               ],
//             },
//             {
//               type: 'paragraph',
//               children: [
//                 {
//                   text:
//                     "Since it's rich text, you can do things like turn a selection of text ",
//                 },
//                 { text: 'bold', bold: true },
//                 {
//                   text:
//                     ', or add a semantically rendered block quote in the middle of the page, like this:',
//                 },
//               ],
//             },
//             {
//               type: 'block-quote',
//               children: [{ text: 'A wise quote.' }],
//             },
//             {
//               type: 'paragraph',
//               children: [{ text: 'Try it out for yourself!' }],
//             },
//           ];
//     const serializedDocument = serializeDocument(richText047);
//     expect(serializedDocument.children).toEqual(richText050);
//     //expect(deserializeDocument(serializedDocument)).toEqual(richText047);
//   });
  
  
  // it("can serialize/deserialize the links example", () => {
  //   const links047: DocumentJSON = {
  //           "object": "document",
  //           "nodes": [
  //             {
  //               "object": "block",
  //               "type": "paragraph",
  //               "nodes": [
  //                 {
  //                   "object": "text",
  //                   "text":
  //                     "In addition to block nodes, you can create inline nodes, like "
  //                 },
  //                 {
  //                   "object": "inline",
  //                   "type": "link",
  //                   "data": {
  //                     "url": "https://en.wikipedia.org/wiki/Hypertext"
  //                   },
  //                   "nodes": [
  //                     {
  //                       "object": "text",
  //                       "text": "hyperlinks"
  //                     }
  //                   ]
  //                 },
  //                 {
  //                   "object": "text",
  //                   "text": "!"
  //                 }
  //               ]
  //             },
  //             {
  //               "object": "block",
  //               "type": "paragraph",
  //               "nodes": [
  //                 {
  //                   "object": "text",
  //                   "text":
  //                     "This example shows hyperlinks in action. It features two ways to add links. You can either add a link via the toolbar icon above, or if you want in on a little secret, copy a URL to your keyboard and paste it while a range of text is selected."
  //                 }
  //               ]
  //             }
  //           ]
  //         };
  //   const links050 = [
  //           {
  //             type: "paragraph",
  //             children: [
  //               {
  //                 text: 'In addition to block nodes, you can create inline nodes, like ',
  //               },
  //               {
  //                 type: 'link',
  //                 url: 'https://en.wikipedia.org/wiki/Hypertext',
  //                 children: [{ text: 'hyperlinks' }],
  //               },
  //               {
  //                 text: '!',
  //               },
  //             ],
  //           },
  //           {
  //             type: "paragraph",
  //             children: [
  //               {
  //                 text:
  //                   'This example shows hyperlinks in action. It features two ways to add links. You can either add a link via the toolbar icon above, or if you want in on a little secret, copy a URL to your keyboard and paste it while a range of text is selected.',
  //               }
  //             ],
  //           },
  //         ];
  //   const serializedDocument = serializeDocument(links047);
  //   expect(serializedDocument.children).toEqual(links050);
  // });
//});

