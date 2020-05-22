import { RenderAttributes } from "slate-react";
import { Block, Inline, Mark } from "slate";
import camelcaseKeys from "camelcase-keys";
import classNames from "classnames/dedupe";
import parseStyle from "style-to-object";

export function getDataFromElement(el: Element, attrs?: string[]) {
  let hasAttr = false;
  const data: Record<string, string> = {};
  ['class', 'style', ...(attrs || [])]
    .forEach(attr => {
      const value = el.getAttribute(attr);
      if (value) {
        data[attr] = value;
        hasAttr = true;
      }
    });
  return hasAttr ? { data } : undefined;
}

export function getRenderAttributesFromNode(obj: Block | Inline | Mark): RenderAttributes {
  const { data } = obj;
  const className: string | undefined = data.get('class');
  const _className = className ? { className } : undefined;
  const styleStr: string | undefined = data.get('style');
  const parsedStyle = styleStr && parseStyle(styleStr);
  const style = parsedStyle && camelcaseKeys(parsedStyle, { exclude: [/^-.*/] });
  const _style = style ? { style } : undefined;
  return { ..._className, ..._style };
}

export function mergeClassStrings(classes1?: string, classes2?: string) {
  const c1 = classes1?.split(" ").filter(c => !!c);
  const c2 = classes2?.split(" ").filter(c => !!c);
  return classNames(c1, c2) || undefined;
}