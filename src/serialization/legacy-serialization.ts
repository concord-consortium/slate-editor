import { textToSlate } from "../common/slate-types";

export function deserializeValueFromLegacy(text: string) {
  const parsed = safeJsonParse(text);
  validateNodeData(parsed?.document);
  return parsed ? parsed : textToSlate("");
          // ? Value.fromJSON(parsed)
          // : textToSlate("");
}

// FIXME: we don't need this, right? delete?
// export function serializeValueToLegacy(value: any) {
//   return JSON.stringify(value.toJSON());
// }

export function validateNodeData(node: any) {
  // strip invalid "className" which can result from prior import/export bugs
  if (node?.data && ("className" in node.data)) {
    delete node.data.className;
  }
  node?.nodes?.forEach((n: any) => validateNodeData(n));
}

export function safeJsonParse(json?: string) {
  let parsed;
  try {
    parsed = json ? JSON.parse(json) : undefined;
  }
  catch (e) {
    // swallow errors
  }
  return parsed;
}
