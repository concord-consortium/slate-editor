import { BlockJSON, DocumentJSON, InlineJSON, MarkJSON, NodeJSON, TextJSON, Value, ValueJSON } from "slate";
import castArray from "lodash/castArray";
import keys from "lodash/keys";
import map from "lodash/map";
import size from "lodash/size";
import values from "lodash/values";

// xxxJSON types correspond to [Classic] Slate 0.47 types
type ElementJSON = BlockJSON | InlineJSON;
type ChildJSON = ElementJSON | TextJSON;

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

type SlateNode = SlateElement | SlateText;

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
  data?: { [key: string]: any };
  document?: SlateDocument;
}

function typeProp(type?: string) {
  return type != null ? { type } : {};
}

function keyProp(key?: string) {
  return key != null ? { key } : {};
}

export function serializeMark(mark: MarkJSON) {
  const { type, data } = mark;
  const dataKeys = data && keys(data);
  const dataValues = data && values(data);
  // special case for single data values, so we get { color: "#aabbcc" }
  // instead of { color: { color: "#aabbcc"} }
  return ((dataValues?.length === 1) && (dataKeys?.[0] === type))
            ? dataValues[0]
            : (dataValues?.length ? data : true);
}

export function serializeTextNode(node: TextJSON): SlateText {
  const { key, text, marks } = node;
  const textNode: SlateText = { ...keyProp(key), text: text || "" };
  marks?.forEach(mark => {
    textNode[mark.type] = serializeMark(mark);
  });
  return textNode;
}

export function serializeChildren(nodes: NodeJSON[], objTypes: ObjectTypeMap): SlateNode[] {
  return nodes.map(node => serializeNode(node, objTypes));
}

// The 0.47 notions of Blocks/Inlines are combined in 0.50 to the notion of Element
export function serializeElement(node: ElementJSON, objTypes: ObjectTypeMap): SlateElement {
  const { object, type, key, nodes, data } = node;
  const children = serializeChildren(castArray(nodes), objTypes);
  const element: SlateElement = { ...typeProp(type), ...keyProp(key), children, ...data };
  object && (objTypes[type] = object);
  return element;
}

export function serializeNode(node: NodeJSON, objTypes: ObjectTypeMap): SlateNode {
  const { object } = node;
  switch (object) {
    case "block":
    case "inline":
      return serializeElement(node as ElementJSON, objTypes);
    case "text":
      return serializeTextNode(node as TextJSON);
    default:
      return (node as ElementJSON)?.nodes
              ? serializeElement(node as ElementJSON, objTypes)
              : serializeTextNode(node as TextJSON);
  }
}

export function serializeDocument(document: DocumentJSON): SlateDocument {
  const { nodes, key, data } = document;
  const objTypes: ObjectTypeMap = {};
  const children = serializeChildren(castArray(nodes), objTypes);
  // return objTypes map as part of document for use in deserialization
  return { ...keyProp(key), children, objTypes, ...data };
}

export function serializeSelection(value: Value) {
  const { document, selection } = value;
  const nodes = document.getDescendantsAtRange(selection).toArray();
  const objTypes: ObjectTypeMap = {};
  return nodes.map(node => serializeNode(node.toJSON(), objTypes));
}

export function serializeValueJSON(value: ValueJSON): SlateExchangeValue {
  const { data: _data, document } = value;
  const { undos, redos, ...others } = _data || {};
  const data = size(others) ? { data: { ...others } } : {};
  return { object: "value", ...data, document: document && serializeDocument(document) };
}

export function serializeValue(value: Value | ValueJSON): SlateExchangeValue {
  const options = value?.data?.size ? { preserveData: true } : undefined;
  return serializeValueJSON(Value.isValue(value) ? value.toJSON(options) : value);
}

export function deserializeMark(type: string, value: any): MarkJSON {
  const mark: MarkJSON = { type };
  if (typeof value === "boolean") return mark;
  if (typeof value === "object") return { ...mark, data: value };
  return { ...mark, data: { [type]: value } };
}

export function deserializeTextNode(node: SlateText): TextJSON {
  const { key, text, ...others } = node;
  const marks = map(others, (value, type) => deserializeMark(type, value));
  const marksVal = marks?.length ? { marks } : {};
  return { object: "text", ...keyProp(key), text, ...marksVal };
}

export function deserializeChildren(children: SlateNode[], objTypes: ObjectTypeMap): ChildJSON[] {
  return children.map(child => deserializeNode(child, objTypes));
}

export function deserializeElement(node: SlateElement, objTypes: ObjectTypeMap): ElementJSON {
  const { type: _type, key, children, ...others } = node;
  const type = _type || "paragraph";
  const object = (objTypes[type] || "block") as any;
  const nodes = deserializeChildren(children, objTypes);
  const data = size(others) ? { data: others } : {};
  return { object, type, ...keyProp(key), nodes, ...data };
}

export function deserializeNode(node: SlateNode, objTypes: ObjectTypeMap): ChildJSON {
  return node.children
          ? deserializeElement(node as SlateElement, objTypes)
          : deserializeTextNode(node as SlateText);
}

export function deserializeDocument(document: SlateDocument): DocumentJSON {
  const { key, children, objTypes } = document;
  return {
    object: "document",
    ...keyProp(key),
    nodes: deserializeChildren(children, objTypes)
  };
}

export function deserializeValue(value: SlateExchangeValue): Value {
  const documentJSON = value.document && deserializeDocument(value.document);
  const dataJSON = value.data ? { data: value.data } : {};
  const valueJSON: ValueJSON = {
    object: "value",
    document: documentJSON,
    ...dataJSON
  };
  return Value.fromJSON(valueJSON);
}
