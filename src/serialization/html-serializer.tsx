import { flatten } from "lodash";
import React, { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Descendant } from "slate";
import { jsx } from "slate-hyperscript";
import { CustomMarks, isLeafTextNode } from "../common/custom-types";
import { SerializingContext } from "../hooks/use-serializing";
import { Element } from "../slate-editor/element";
import { Leaf } from "../slate-editor/leaf";
import { escapeNbsp } from "./html-utils";

/*
  Serializer/Deserializer registration
 */
interface MarkDeserializer {
  test: (el: HTMLElement) => boolean;
  deserialize: (el: HTMLElement, marks: CustomMarks) => void;
}
const markElementTags = new Set<string>();
const markDeserializers: MarkDeserializer[] = [];

interface ElementDeserializer {
  test?: (el: HTMLElement) => boolean;
  deserialize: (el: HTMLElement, children: Descendant[]) => Descendant;
}
const elementDeserializers: Record<string, ElementDeserializer[]> = {};

export function registerMarkDeserializer(tag: string, deserializer: MarkDeserializer) {
  markElementTags.add(tag);
  markDeserializers.push(deserializer);
}

export function registerElementDeserializer(tag: string, deserializer: ElementDeserializer) {
  if (!elementDeserializers[tag]) {
    elementDeserializers[tag] = [deserializer];
  }
  else {
    // later deserializers are inserted first so default <span> deserializer is last
    elementDeserializers[tag].splice(0, 0, deserializer);
  }
}

/*
  htmlToSlate()
  Make sure the slate editor has been initialized before calling this!
 */
export function htmlToSlate(html: string) {
  try {
    const document = new DOMParser().parseFromString(html, 'text/html');
    const slate = deserialize(document.body);
    if (!slate) return [];
    if (!Array.isArray(slate)) return [slate];
    const processed: Descendant[] = [];
    slate.forEach((node: Descendant) => {
      // Check for top level nodes that weren't wrapped in a <p> or other block element.
      if (isLeafTextNode(node)) {
        // If they're empty (like a `\n` for a multiline html), skip them.
        // If they have content, wrap them in a paragraph node.
        if (/\S/.test(node.text)) {
          processed.push({
            type: "paragraph",
            children: [node]
          });
        }
      } else {
        processed.push(node);
      }
    });
    return processed;
  }
  catch(e) {
    console.warn("exception caught, returning empty content");
    return [];
  }
}

/*
  slateToHtml()
 */
export function slateToHtml(value: Descendant[]) {
  let fullHtml = "";
  value.forEach(block => {
    const elem = serialize(block);
    const blockHtml = renderToStaticMarkup(
      <SerializingContext.Provider value={true}>
        {elem}
      </SerializingContext.Provider>
    );
    fullHtml += blockHtml;
  });
  // After previously encoding non-breaking spaces,
  // renderToStaticMarkup() re-escapes so we have to unescape.
  return fullHtml.replace(/&amp;nbsp;/g, "&nbsp;");
}

/*
  Deserialization helpers
 */
function isTextNode(el: Node) {
  return el.nodeType === Node.TEXT_NODE;
}

function isElementNode(el: Node): el is HTMLElement {
  return el.nodeType === Node.ELEMENT_NODE;
}

const deserialize = (el: Node, markAttributes: CustomMarks = {}): Descendant | Descendant[] | null => {
  const elTag = el.nodeName.toLowerCase();

  if (isTextNode(el)) {
    return jsx('text', markAttributes, el.textContent);
  }

  if (!isElementNode(el)) {
    console.warn("bailing... element is not of type:", Node.ELEMENT_NODE);
    return null;
  }

  const marks: CustomMarks = { ...markAttributes };

  // convert mark elements to mark properties
  let isMarkElement = false;
  if (markElementTags.has(elTag)) {
    markDeserializers.forEach(entry => {
      if (entry.test(el)) {
        isMarkElement = true;
        entry.deserialize(el, marks);
      }
    });
  }

  const children = flatten(Array.from(el.childNodes).map(node => deserialize(node, marks)))
                    .filter(child => child != null) as Descendant[];

  if (children.length === 0) {
    children.push(jsx('text', marks, ''));
  }

  if (!isMarkElement) {
    const eltDeserializers = elementDeserializers[elTag];
    if (eltDeserializers) {
      for (const eltDeserializer of eltDeserializers) {
        if (!eltDeserializer.test || eltDeserializer.test(el)) {
          return eltDeserializer.deserialize(el, children);
        }
      }
    }
  }

  return jsx('fragment', { tag: elTag }, children);
};

/*
  Serialization helpers
 */

// cf. https://docs.slatejs.org/concepts/10-serializing#html
export function serialize (node: Descendant): ReactNode {
  if (isLeafTextNode(node)) {
    // escape non-breaking spaces for legibility
    return <Leaf leaf={node} text={node} attributes={{} as any}>{escapeNbsp(node.text)}</Leaf>;
  }

  const _children = node.children?.map(n => serialize(n));

  const children = Array.isArray(_children) && _children.length <= 1 ? _children[0] : _children;
  return (
    <Element element={node} attributes={{} as any}>
      {children}
    </Element>
  );
}
