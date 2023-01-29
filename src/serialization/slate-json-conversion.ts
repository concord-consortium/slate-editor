import castArray from "lodash/castArray";
import keys from "lodash/keys";
import values from "lodash/values";
import { ElementJSON, MarkJSON, NodeJSON, ObjectTypeMap, SlateNode, TextJSON } from "./serialization";

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