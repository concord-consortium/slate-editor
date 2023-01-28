import { Descendant} from "slate";


// xxxJSON types correspond to [Classic] Slate 0.47 types
export type ElementJSON = any; //BlockJSON | InlineJSON;
export type ChildJSON = any; // ElementJSON | TextJSON;

// SlateXXX types correspond to [Current] Slate 0.50+ types
interface SlateText {
  key?: string;
  text: string;
  [key: string]: any;
}

interface SlateElement {
  key?: string;
  children: SlateNode[];
  [key: string]: any;
}

export type NodeJSON = any;
export type BlockJSON = any;
export type MarkJSON = any;
export type TextJSON = any;
export type DocumentJSON = any;
export type Value = any;
export type ValueJSON = any;
export type BaseElement = any;
export type InlineJSON = any;

type DocumentMetadata = Record<string, any>;

export type SlateNode = SlateElement | SlateText;

// map from type (e.g. paragraph or link) to object type (e.g. block or inline)
export type ObjectTypeMap = Record<string, string>;

export interface SlateDocument {
  key?: string;
  children: SlateNode[];
  // types map used for conversion back to Classic Slate (0.47)
  objTypes: ObjectTypeMap;
}

export interface SlateExchangeValue {
  object: "value";
  data?: DocumentMetadata;
  document?: BaseElement;
}

export function serializeDocument(document: Descendant[]) {
  return { children: document };
}

// FIXME: This needs to be updated to the new slate API.
// export function serializeSelection(value: Value) {
//   const { document, selection } = value;
//   const nodes = document.getDescendantsAtRange(selection).toArray();
//   const objTypes: ObjectTypeMap = {};
//   //return nodes.map((node:any) => serializeNode(node.toJSON(), objTypes));
// }

export function serializeValue(document: any, metadata?: any): any {
  const data = metadata ? { data: metadata } : undefined;
  return { object: "value", ...data, document: serializeDocument(document)};
}