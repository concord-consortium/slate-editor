import React, { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import HtmlSerializer from "slate-html-serializer";
import { Value } from "slate";
import { HtmlSerializationRule } from "../plugins/html-serializable-plugin";
import { ColorPlugin } from "../plugins/color-plugin";
import { CoreBlocksPlugin } from "../plugins/core-blocks-plugin";
import { CoreInlinesPlugin } from "../plugins/core-inlines-plugin";
import { CoreMarksPlugin } from "../plugins/core-marks-plugin";
import { ImagePlugin } from "../plugins/image-plugin";
import { LinkPlugin } from "../plugins/link-plugin";
import { ListPlugin } from "../plugins/list-plugin";
import { TablePlugin } from "../plugins/table-plugin";

// A modified version of the TEXT_RULE from the slate-html-serializer with
// special handling for &nbsp;
const TEXT_RULE: HtmlSerializationRule = {
  deserialize(el) {
    if (el.tagName && el.tagName.toLowerCase() === 'br') {
      return {
        object: 'text',
        text: '\n',
        marks: [],
      };
    }

    if (el.nodeName === '#text') {
      if (el.nodeValue && el.nodeValue.match(/<!--.*?-->/)) return;

      return {
        object: 'text',
        text: el.nodeValue,
        marks: [],
      };
    }
  },

  serialize(obj, children) {
    if (obj.object === 'string') {
      return children.split('\n').reduce((array, text, i) => {
        if (i !== 0) array.push(<br key={i} />);
        // encode non-breaking spaces (for visibility)
        array.push(text.replace(/\u00A0/g, "&nbsp;"));
        return array;
      }, [] as ReactNode[]);
    }
  },

  postSerialize: function(html) {
    // After encoding non-breaking spaces in the TEXT_RULE above,
    // renderToStaticMarkup() re-escapes so we have to unescape.
    return html.replace(/&amp;nbsp;/g, "&nbsp;");
  }
};

const rules: HtmlSerializationRule[] = [
        ColorPlugin(), CoreMarksPlugin(),
        ImagePlugin(), LinkPlugin(), CoreInlinesPlugin(),
        ListPlugin(), TablePlugin(), CoreBlocksPlugin(),
        TEXT_RULE];

const htmlSerializer = new HtmlSerializer({ rules });

export function htmlToSlate(html: string) {
  return htmlSerializer.deserialize(html);
}

export function slateToHtml(value: Value) {
  const blocks = htmlSerializer.serialize(value, { render: false });
  // we render each top-level block element separately, so they each end up on their own line.
  const htmlStrings = blocks.map(block => renderToStaticMarkup(<body>{block}</body>).slice(6, -7));
  let html = htmlStrings.join("\n");
  for (const rule of rules) {
    // give plugins a chance to post-process the generated HTML
    rule.postSerialize && (html = rule.postSerialize(html));
  }
  return html;
}
