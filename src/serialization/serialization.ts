import { BaseElement, Descendant, Editor } from "slate";

// document-level metadata like fontSize
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

export function serializeSelection(editor: Editor) {
  const nodes = editor.getFragment();
  return nodes.map(node => deserializeNode(node));
}

export function serializeValue(document: Descendant[], metadata?: DocumentMetadata): SlateExchangeValue {
   const data = metadata ? { data: metadata } : undefined;
  return { object: "value", ...data, document: serializeDocument(document /*, metadata */) };
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
