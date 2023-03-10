import classNames from "classnames/dedupe";
import { escape as escapeHtml } from "html-escaper";
import { CSSProperties } from "react";
import rgbHex from "rgb-hex";
import { Descendant } from "slate";
import parseStyle from "style-to-object";

export function escapeHtmlAndNbsp(text: string) {
  return escapeNbsp(escapeHtml(text));
}

export function escapeNbsp(text: string) {
  return text.replace(/\u00A0/g, "&nbsp;");
}

export type RenderAttributes = Record<string, string | CSSProperties>;

export function toReactAttributeKey(key: string) {
  return key.toLowerCase()
            .replace("class", "className")
            .replace("colspan", "colSpan")
            .replace("rowspan", "rowSpan");
}

export function toReactStyleKey(key: string) {
  // https://github.com/facebook/react/blob/5f6b75dd265cd831d2c4e407c4580b9cd7d996f5/packages/react-dom/src/shared/DOMProperty.js#L447-L448
  const CAMELIZE = /[-:]([a-z])/g;
  return key.replace(CAMELIZE, token => token[1].toUpperCase());
}

export function toHexIfColor(s: string) {
  if (s.includes("rgb")) {
    try {
      const hex = rgbHex(s);
      return `#${hex}` || s;
    }
    catch(e) {
      // ignore
    }
  }
  return s;
}

export function toReactStyle(styleStr?: string): React.CSSProperties | undefined {
  const style: Record<string, string> = {};
  let count = 0;
  styleStr && parseStyle(styleStr, (name, value) => {
                // convert to react key format (ignoring custom css properties)
                const key = /^--.*/.test(name) ? name : toReactStyleKey(name);
                style[key] = toHexIfColor(value);
                ++count;
              });
  return count ? style as React.CSSProperties : undefined;
}

export function getDataFromElement(el: Element, _data?: Record<string, string>) {
  if (!el.hasAttributes()) return { data: _data };
  const data: Record<string, string> = _data || {};
  for (let i = 0; i < el.attributes.length; ++i) {
    let key = el.attributes[i].name.toLowerCase();
    if (key === "classname") key = "class";
    data[key] = el.attributes[i].value;
  }
  return { data };
}

export function getElementAttrs(el: Element, omits: string[] = []) {
  if (!el.hasAttributes()) return {};
  const attrs: Record<string, string> = {};
  for (let i = 0; i < el.attributes.length; ++i) {
    let key = el.attributes[i].name.toLowerCase();
    if (!omits.includes(key)) {
      if (key === "classname") key = "class";
      attrs[key] = el.attributes[i].value;
    }
  }
  return { attrs };
}

export function getRenderAttributesFromNode(obj: Descendant, omitProps?: string[]): RenderAttributes {
  const attrs: Record<string, string> | undefined = (obj as any).attrs;
  const renderAttrs: RenderAttributes = {};
  if (attrs) {
    for (const key in attrs) {
      const _key = toReactAttributeKey(key);
      if (!omitProps?.find(prop => prop === _key)) {
        const value = _key === "style" ? toReactStyle(attrs[key]) : attrs[key];
        value && (renderAttrs[_key] = value);
      }
    }
  }
  return renderAttrs;
}

export function classArray(classes?: string) {
  return classes?.split(" ").filter(c => !!c);
}

export function mergeClassStrings(classes1?: string, classes2?: string) {
  return classNames(classArray(classes1), classArray(classes2)) || undefined;
}

export function normalizeStyleString(style: string) {
  return style.replace(/: /g, ":")
              .replace(/; /g, ";")
              .replace(/;$/, "");
}

export function normalizeHtml(html: string) {
  // find style attributes in html
  const styleRegex = /style="(.*?)"/g;
  const styleMatches: Array<RegExpExecArray> = [];
  let execResult: RegExpExecArray | any;
  while ((execResult = styleRegex.exec(html)) != null) {
    styleMatches.push(execResult);
  }
  // normalize style attributes
  let normalized = html;
  styleMatches.forEach(match => {
    const normalizedStyle = normalizeStyleString(match[1]);
    normalized = normalized.replace(match[0], `style="${normalizedStyle}"`);
  });
  // decode escaped HTML entities
  // normalized = entities.decode(normalized);
  // normalize remaining html tags
  return normalized
          // some activities use &rsquo; for an apostrophe, but there's no reason to escape it
          .replace(/&rsquo;/, "’")
          .replace(/ \/>/g, "/>")
          // we don't serialize rel attributes of anchor tags
          .replace(/ rel=".*?"/g, "");
}
