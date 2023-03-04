import { EditorValue } from "../common/slate-types";
import { textToSlate } from "..";
import { deserializeValueFromLegacy, serializeValueToLegacy } from "./legacy-serialization";

const emptyJson: EditorValue = [
  {
    type: "paragraph",
    children: [
      {
        text: ""
      }
    ]
  }
];
const emptyJSONStr = JSON.stringify(emptyJson);

const emptyLegacyJson = serializeValueToLegacy(textToSlate(""));

// TODO Is this still an issue? If so, how can we test it?
// Trying to add className to the paragraph in emptyJson resulted in a type error.
// due to prior import bugs, we sometimes encounter "className" properties
// const emptyJsonWithClassName: ValueJSON = {
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

describe("legacy serialization", () => {
  it("de/serializes empty strings", () => {
    expect(serializeValueToLegacy(textToSlate(""))).toBe(emptyJSONStr);
    expect(serializeValueToLegacy(deserializeValueFromLegacy(emptyJSONStr))).toBe(emptyJSONStr);
  });

  it("converts invalid JSON to empty strings", () => {
    expect(serializeValueToLegacy(deserializeValueFromLegacy(null as any))).toBe(emptyLegacyJson);
    expect(serializeValueToLegacy(deserializeValueFromLegacy("}"))).toBe(emptyLegacyJson);
  });

  // it("strips invalid 'className' properties", () => {
  //   expect(serializeValueToLegacy(deserializeValueFromLegacy(emptyJsonWithClassNameStr))).toBe(emptyLegacyJson);
  // });
});
