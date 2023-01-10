import { EditorValue, textToSlate } from "../common/slate-types";

export function deserializeValueFromLegacy(text: string) {
  const parsed = safeJsonParse(text);
  validateNodeData(parsed?.document);
  return parsed ?? textToSlate("");
}

export function serializeValueToLegacy(value: EditorValue) {
  return JSON.stringify(value);
}

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
