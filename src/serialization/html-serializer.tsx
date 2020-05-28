import HtmlSerializer, { Rule } from "slate-html-serializer";
import { Block, Mark, Value } from "slate";
import { getDataFromElement, getRenderAttributesFromNode } from "./html-utils";
import { renderSlateBlock, renderOneSlateMark } from "../slate-editor/slate-renderers";
import { isBlockFormat, isMarkFormat } from "../common/slate-types";
import { htmlRule as colorRule } from "../plugins/color-plugin";
import { htmlRule as imageRule } from "../plugins/image-plugin";
import { htmlRule as linkRule } from "../plugins/link-plugin";

// map from html tag => block format
const kBlockTags: Record<string, string> = {
        blockquote: "block-quote",
        h1: "heading1",
        h2: "heading2",
        h3: "heading3",
        h4: "heading4",
        h5: "heading5",
        h6: "heading6",
        hr: "horizontal-rule",
        li: "list-item",
        ol: "ordered-list",
        p: "paragraph",
        ul: "bulleted-list"
      };
const simpleBlocksRule: Rule = {
  deserialize: function(el, next) {
    const type = kBlockTags[el.tagName.toLowerCase()];
    if (type) {
      const data = getDataFromElement(el);
      return {
        object: 'block',
        type: type,
        ...data,
        nodes: next(el.childNodes),
      };
    }
  },
  serialize: function(obj, children) {
    const { object, type } = obj;
    if ((object === "block") && ((type === "") || isBlockFormat(type))) {
      const block: Block = obj;
      return renderSlateBlock(block, getRenderAttributesFromNode(block), children);
    }
  }
};

// map from html tag => mark format
const kMarkTags: Record<string, string> = {
        code: "code",
        del: "deleted",
        em: "italic",
        mark: "inserted",
        strong: "bold",
        sub: "subscript",
        sup: "superscript",
        u: "underlined"
      };
const simpleMarksRule: Rule = {
  deserialize(el, next) {
    const type = kMarkTags[el.tagName.toLowerCase()];
    if (type) {
      const data = getDataFromElement(el);
      return {
        object: 'mark',
        type: type,
        ...data,
        nodes: next(el.childNodes),
      };
    }
  },
  serialize(obj, children) {
    const { object, type } = obj;
    if ((object === 'mark') && isMarkFormat(type)) {
      const mark: Mark = obj;
      return renderOneSlateMark(mark, getRenderAttributesFromNode(mark), children);
    }
  },
};

const rules: Rule[] = [colorRule, imageRule, linkRule, simpleBlocksRule, simpleMarksRule];

const htmlSerializer = new HtmlSerializer({ rules });

export function htmlToSlate(html: string) {
  return htmlSerializer.deserialize(html);
}

export function slateToHtml(value: Value) {
  return htmlSerializer.serialize(value);
}
