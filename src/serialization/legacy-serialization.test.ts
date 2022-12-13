
describe("serializer", () => {
  it("TODO: fix commented out tests", () => {
    expect(true).toBe(true);
  });
});
// import { textToSlate } from "..";
// import { deserializeValueFromLegacy, serializeValueToLegacy } from "./legacy-serialization";

// const emptyJson = {
//               object: "value",
//               document: {
//                 "object": "document",
//                 data: {},
//                 nodes: [{
//                   object: "block",
//                   type: "paragraph",
//                   data: {},
//                   nodes: [{
//                     object: "text",
//                     text: "",
//                     marks: []
//                   }]
//                 }]
//               }
//             };
// const emptyJSONStr = JSON.stringify(emptyJson);

// const emptyLegacyJson = serializeValueToLegacy(textToSlate(""));

// // due to prior import bugs, we sometimes encounter "className" properties
// const emptyJsonWithClassName = {
//               object: "value",
//               document: {
//                 "object": "document",
//                 data: {},
//                 nodes: [{
//                   object: "block",
//                   type: "paragraph",
//                   data: {
//                     className: null
//                   },
//                   nodes: [{
//                     object: "text",
//                     text: "",
//                     marks: []
//                   }]
//                 }]
//               }
//             };
// const emptyJsonWithClassNameStr = JSON.stringify(emptyJsonWithClassName);

// describe("legacy serialization", () => {
//   it("de/serializes empty strings", () => {
//     expect(serializeValueToLegacy(textToSlate(""))).toBe(emptyJSONStr);
//     expect(serializeValueToLegacy(deserializeValueFromLegacy(emptyJSONStr))).toBe(emptyJSONStr);
//   });

//   it("converts invalid JSON to empty strings", () => {
//     expect(serializeValueToLegacy(deserializeValueFromLegacy(null as any))).toBe(emptyLegacyJson);
//     expect(serializeValueToLegacy(deserializeValueFromLegacy("}"))).toBe(emptyLegacyJson);
//   });

//   it("strips invalid 'className' properties", () => {
//     expect(serializeValueToLegacy(deserializeValueFromLegacy(emptyJsonWithClassNameStr))).toBe(emptyLegacyJson);
//   });
// });
