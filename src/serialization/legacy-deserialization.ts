/*
  Legacy Deserialization

  Although the slate-editor library was initially developed using the legacy slate library (0.47),
  the file format was designed to be compatible with the 0.50+ version of the library, which had
  already been introduced. Thus serialization from the standpoint of the slate-editor library
  at that time meant converting from the model format used by the 0.47 slate library to a format
  closely aligned with the 0.50+ slate library format. As a result, clients such as CODAP that
  adopted the slate-editor library have been serializing in 0.50+ compatible form all along.
  Clients such as CLUE, however, that started serializing documents before the development of
  the slate-editor library serialized their content using the legacy (0.47) format.

  When the slate-editor library was updated to use the latest slate library versions, it was
  no longer necessary to convert legacy model format to current model format when serializing
  because the internal representation of the slate model is compatible with the way the
  slate-editor library has been serializing all along. For clients such as CLUE using the legacy
  file format, the same conversion code that used to handle serialization from legacy to modern
  can now be used to deserialize legacy CLUE documents to modern slate library representations.
 */
import castArray from "lodash/castArray";
import keys from "lodash/keys";
import values from "lodash/values";

// xxxJSON types correspond to [Classic] Slate 0.47 types
export type ElementJSON = any; //BlockJSON | InlineJSON;
export type ChildJSON = any; // ElementJSON | TextJSON;

// SlateXXX types correspond to [Current] Slate 0.50+ types
interface SlateElement {
  key?: string;
  children: SlateNode[];
  [key: string]: any;
}
interface SlateText {
  key?: string;
  text: string;
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

export type SlateNode = SlateElement | SlateText;

// map from type (e.g. paragraph or link) to object type (e.g. block or inline)
export type ObjectTypeMap = Record<string, string>;

function typeProp(type?: string) {
  return type != null ? { type } : {};
}

function keyProp(key?: string) {
  return key != null ? { key } : {};
}

export function slate47to50(document: any, metadata?: any) : any {
  const data = metadata ? { data: metadata } : undefined;
  return { object: "value", ...data, document: convertDocument(document), metadata};
}
export function convertDocument(document: any): any {
  const { nodes, key, data } = document;
  const objTypes: ObjectTypeMap = {};
  const children = convertChildren(castArray(nodes), objTypes);
  // return objTypes map as part of document for use in deserialization
  return { ...keyProp(key), children, objTypes, ...data };
}
export function convertElement(node: ElementJSON, objTypes: ObjectTypeMap): SlateElement {
  const { object, type, key, nodes, data } = node;
  const children = convertChildren(castArray(nodes), objTypes);
  const element: SlateElement = { ...typeProp(type), ...keyProp(key), children, ...data };
  object && (objTypes[type] = object);
  return element;
}
export function convertNode(node: NodeJSON, objTypes: ObjectTypeMap): SlateNode {
  const { object } = node;
  switch (object) {
    case "block":
    case "inline":
      return convertElement(node as ElementJSON, objTypes);
    case "text":
      return convertTextNode(node as TextJSON);
    default:
      return (node as ElementJSON)?.nodes
              ? convertElement(node as ElementJSON, objTypes)
              : convertTextNode(node as TextJSON);
  }
}
 export function convertMark(mark: MarkJSON) {
  const { type, data } = mark;
  const dataKeys = data && keys(data);
  const dataValues = data && values(data);
  // special case for single data values, so we get { color: "#aabbcc" }
  // instead of { color: { color: "#aabbcc"} }
  return ((dataValues?.length === 1) && (dataKeys?.[0] === type))
            ? dataValues[0]
            : (dataValues?.length ? data : true);
}
export function convertTextNode(node: TextJSON): SlateText {
  const { key, text, marks } = node;
  const textNode: SlateText = { ...keyProp(key), text: text || "" };
  marks?.forEach((mark: any) => {
    textNode[mark.type] = convertMark(mark);
  });
  return textNode;
}
export function convertChildren(nodes: NodeJSON[], objTypes: ObjectTypeMap): SlateNode[] {
  return nodes.map(node => convertNode(node, objTypes));
}
