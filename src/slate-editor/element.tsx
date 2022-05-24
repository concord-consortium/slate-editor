import React from "react";
import { RenderElementProps } from "slate-react";
import { CustomElement, RenderElementAttrs } from "../common/custom-types";
import { EFormat } from "../common/slate-types";

function eltRenderAttrs(element: CustomElement) {
  const attrs: any = {};

  if ((element as any).align) {
    attrs.textAlign = (element as any).align;
  }

  return attrs;
}

export type ElementRenderFn = (attrs: RenderElementAttrs, children: any, element: CustomElement) => JSX.Element;
const elementRenderMap: Partial<Record<string, ElementRenderFn>> = {
  [EFormat.blockQuote]: (attrs, children, element) => {
    return <blockquote {...attrs} {...eltRenderAttrs(element)}>{children}</blockquote>;
  },
  [EFormat.bulletedList]: (attrs, children, element) => {
    return <ul {...attrs} {...eltRenderAttrs(element)}>{children}</ul>;
  },
  [EFormat.heading1]: (attrs, children, element) => {
    return <h1 {...attrs} {...eltRenderAttrs(element)}>{children}</h1>;
  },
  [EFormat.heading2]: (attrs, children, element) => {
    return <h2 {...attrs} {...eltRenderAttrs(element)}>{children}</h2>;
  },
  [EFormat.heading3]: (attrs, children, element) => {
    return <h3 {...attrs} {...eltRenderAttrs(element)}>{children}</h3>;
  },
  [EFormat.heading4]: (attrs, children, element) => {
    return <h4 {...attrs} {...eltRenderAttrs(element)}>{children}</h4>;
  },
  [EFormat.heading5]: (attrs, children, element) => {
    return <h5 {...attrs} {...eltRenderAttrs(element)}>{children}</h5>;
  },
  [EFormat.heading6]: (attrs, children, element) => {
    return <h6 {...attrs} {...eltRenderAttrs(element)}>{children}</h6>;
  },
  [EFormat.horizontalRule]: (attrs, children, element) => {
    return <hr {...attrs} {...eltRenderAttrs(element)}>{children}</hr>;
  },
  [EFormat.listItem]: (attrs, children, element) => {
    return <li {...attrs} {...eltRenderAttrs(element)}>{children}</li>;
  },
  [EFormat.numberedList]: (attrs, children, element) => {
    return <ol {...attrs} {...eltRenderAttrs(element)}>{children}</ol>;
  },
  [EFormat.preformatted]: (attrs, children, element) => {
    return <pre {...attrs} {...eltRenderAttrs(element)}>{children}</pre>;
  }
};

export function registerElementRenderFn(format: string, elementRenderFn: ElementRenderFn) {
  elementRenderMap[format] = elementRenderFn;
}

export const Element = ({ attributes, children, element }: RenderElementProps) => {
  const renderFn = elementRenderMap[element.type];
  if (renderFn) return renderFn(attributes, children, element);

  // default to simple paragraph
  return <p {...attributes} {...eltRenderAttrs(element)}>{children}</p>;
};
