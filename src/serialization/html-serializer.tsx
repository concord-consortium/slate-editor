//import React, { ReactNode } from "react";
//import { renderToStaticMarkup } from "react-dom/server";
//import { Value } from "slate";
// import { HtmlSerializationRule } from "../plugins/html-serializable-plugin";
// import { ColorPlugin } from "../plugins/color-plugin";
// import { CoreBlocksPlugin } from "../plugins/core-blocks-plugin";
// import { CoreInlinesPlugin } from "../plugins/core-inlines-plugin";
// import { CoreMarksPlugin } from "../plugins/core-marks-plugin";
// import { ImagePlugin } from "../plugins/image-plugin";
// import { LinkPlugin } from "../plugins/link-plugin";
// import { ListPlugin } from "../plugins/list-plugin";
// import { TablePlugin } from "../plugins/table-plugin";

// A modified version of the TEXT_RULE from the slate-html-serializer with
// special handling for &nbsp;
// const TEXT_RULE: HtmlSerializationRule = {
//   deserialize(el) {
//     if (el.tagName && el.tagName.toLowerCase() === 'br') {
//       return {
//         object: 'text',
//         text: '\n',
//         marks: [],
//       };
//     }

//     if (el.nodeName === '#text') {
//       if (el.nodeValue?.match(/<!--.*?-->/)) return;

//       return {
//         object: 'text',
//         text: el.nodeValue,
//         marks: [],
//       };
//     }
//   },

//   serialize(obj:any, children:any) {
//     if (obj.object === 'string') {
//       return children.split('\n').reduce((array: any, text: string, i: React.Key | null | undefined) => {
//         if (i !== 0) array.push(<br key={i} />);
//         // encode non-breaking spaces (for visibility)
//         array.push(text.replace(/\u00A0/g, "&nbsp;"));
//         return array;
//       }, [] as ReactNode[]);
//     }
//   },

//   postSerialize: function(html) {
//     // After encoding non-breaking spaces in the TEXT_RULE above,
//     // renderToStaticMarkup() re-escapes so we have to unescape.
//     return html.replace(/&amp;nbsp;/g, "&nbsp;");
//   }
// };

// const rules: HtmlSerializationRule[] = [
//         ColorPlugin(), CoreMarksPlugin(),
//         ImagePlugin(), LinkPlugin(), CoreInlinesPlugin(),
//         ListPlugin(), TablePlugin(), CoreBlocksPlugin(),
//         TEXT_RULE];

//const htmlSerializer = new HtmlSerializer({ rules });
import { jsx } from 'slate-hyperscript';
import escapeHtml from 'escape-html'
import { Descendant, Text as SlateText} from 'slate';
import { Leaf } from '../slate-editor/leaf';
import { CustomElement, EditorValue, EFormat } from '../common/slate-types';
import { renderToStaticMarkup } from "react-dom/server";
import { Element } from '../slate-editor/element';
import React from 'react';
import { isCustomText } from '../slate-editor/slate-utils';
import { SerializingContext } from '../hooks/use-serializing';


const deserialize = (el, markAttributes = {}) => {
  if (el.nodeType === Node.TEXT_NODE) {
    return jsx('text', markAttributes, el.textContent)
  } else if (el.nodeType !== Node.ELEMENT_NODE) {
    return null
  }

  const nodeAttributes = { ...markAttributes }

  // define attributes for text nodes
  switch (el.nodeName) {
    case 'strong':
      nodeAttributes.bold = true
  }

  const children = Array.from(el.childNodes)
    .map(node => deserialize(node, nodeAttributes))
    .flat()

  if (children.length === 0) {
    children.push(jsx('text', nodeAttributes, ''))
  }

  switch (el.nodeName) {
    case 'BODY':
      return jsx('fragment', {}, children)
    case 'BR':
      return '\n'
    case 'BLOCKQUOTE':
      return jsx('element', { type: 'quote' }, children)
    case 'P':
      return jsx('element', { type: 'paragraph' }, children)
    case 'A':
      return jsx(
        'element',
        { type: 'link', url: el.getAttribute('href') },
        children
      )
    default:
      return children
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
    console.log('doing stuff');
    return serialize(n);
  }); 
  
  if (node.type) {
    const props = {
      children: children,
      element: {type: node.type, children: node.children},
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


