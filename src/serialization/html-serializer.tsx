// @ts-nocheck
import { jsx } from 'slate-hyperscript';
import { Leaf, markNodeMap } from '../slate-editor/leaf';
import { renderToStaticMarkup } from "react-dom/server";
import { Element, elementTypeMap } from '../slate-editor/element';
import React from 'react';
import { isCustomText } from '../slate-editor/slate-utils';
import { SerializingContext } from '../hooks/use-serializing';
import { CustomElement } from '../common/slate-types';


const deserialize = (el, markAttributes = {}) => {
  if (el.nodeType === Node.TEXT_NODE) {
    return jsx('text', markAttributes, el.textContent)
  } else if (el.nodeType !== Node.ELEMENT_NODE) {
    return null
  }

  const nodeAttributes = { ...markAttributes }

  const textMark = markNodeMap[el.nodeName.toLowerCase()];
  if (textMark) {
    nodeAttributes[textMark] = true;
  }

  const children = Array.from(el.childNodes)
    .map(node => deserialize(node, nodeAttributes))
    .flat()

  if (children.length === 0) {
    children.push(jsx('text', nodeAttributes, ''))
  }

  // This is assuming there's 1:1 mapping of tag to elements which is probably not true...
  const elementTag = elementTypeMap[el.nodeName.toLowerCase()];
  if (elementTag) {
    const atts = el.getAttributeNames();
    var obj = {};
    obj.type = elementTag;
    // FIXME:
    // Copy attributes from html tag to jsx object. 
    // This isn't necessarily a 1:1 mapping so this only kinda works.
    atts.forEach(a => obj[a] = el[a]); 
    return jsx('element', obj, children);
  }
  switch (el.nodeName) {
    case 'BODY':
      return jsx('fragment', {}, children);
    case 'BR':
      return '\n'
    case 'P' :
      return jsx('element', { type: 'paragraph' }, children);
    case 'DIV' :
      return jsx('element', { type: 'block' }, children);
    default:
      return children;
  }
}

export function serialize (node) {
  if (isCustomText(node)) {
    const props = {
      leaf: node,
      text: node.text,
      children: node.text
    }
    const leaf = React.createElement(Leaf, props);
    return leaf;
  }

 
  const children = node.children?.map(n => {
    return serialize(n);
  }); 
  
  if (node.type) {
    const props = {
      children: children,
      element: node
    };
    const elem = React.createElement(Element, props);
    return elem;
  }
}

export function htmlToSlate(html: string) {
  console.log('htmlToSlate is broken');
  const document = new DOMParser().parseFromString(html, 'text/html');
  const val = deserialize(document.body);
  return val;
}

export function slateToHtml(value: Node[]) {
  let fullHtml = '';
  value.forEach(block => {
    const elem = serialize(block);
    const blockHtml = renderToStaticMarkup(
      <SerializingContext.Provider value={true}>
        {elem}
      </SerializingContext.Provider>
        );
    fullHtml += blockHtml;
  });
  return fullHtml;
}


