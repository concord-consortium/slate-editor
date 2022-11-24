import { BaseElement, Descendant } from "slate";

// export interface SlateDocument {
//   key?: string; // ???
//   children: EditorValue;
// }

type DocumentMetadata = Record<string, any>;

export interface SlateExchangeValue {
  object: "value";
  // document-level metadata like fontSize
  data?: DocumentMetadata;
  document?: BaseElement;
}

export function serializeDocument(document: Descendant[]) {
  return { children: document };
}

// export function serializeSelection(value: Value) {
//   const { document, selection } = value;
//   const nodes = document.getDescendantsAtRange(selection).toArray();
//   const objTypes: ObjectTypeMap = {};
//   return nodes.map(node => serializeNode(node.toJSON(), objTypes));
// }

// export function serializeValueJSON(value: ValueJSON): SlateExchangeValue {
//   const { data: _data, document } = value;
//   const { undos, redos, ...others } = _data || {};
//   const data = size(others) ? { data: { ...others } } : {};
//   return { object: "value", ...data, document: document && serializeDocument(document) };
// }

export function serializeValue(document: Descendant[], metadata?: DocumentMetadata): SlateExchangeValue {
   const data = metadata ? { data: metadata } : undefined;
  return { object: "value", ...data, document: serializeDocument(document, metadata) };
}

export function deserializeChildren(children: Descendant[]) {
  return children.map(child => deserializeNode(child));
}

export function deserializeNode(node: Descendant): Descendant {
  const { children: _children, className: _className, ...others } = node as any;
  const children: BaseElement | undefined = _children
                    ? { children: deserializeChildren(_children) }
                    : undefined;
  // "className" should be converted to "class" on import but it wasn't always so
  const className = _className ? { class: _className } : undefined;
  return { ...others, ...children, ...className };
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
