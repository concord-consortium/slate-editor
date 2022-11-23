import React from "react";
import { RenderElementProps } from "slate-react";
import { CustomElement, EFormat } from "../common/slate-types";

function eltRenderAttrs(element: CustomElement) {
  const attrs: any = {};

  if ((element as any).align) {
    attrs.textAlign = (element as any).align;
  }

  return attrs;
}

export const elementTypeMap: Record<string, string> = {
  "blockquote" : EFormat.blockQuote,
  "ul" : EFormat.bulletedList,
  "h1" : EFormat.heading1,
  "h2" : EFormat.heading2,
  "h3" : EFormat.heading3,
  "h4" : EFormat.heading4,
  "h5" : EFormat.heading5,
  "h6" : EFormat.heading6,
  "hr" : EFormat.horizontalRule,
  "li" : EFormat.listItem,
  "ol" : EFormat.numberedList,
  "pre" : EFormat.preformatted,
  "a" : "link",
  "img" : "image",
  "div" : EFormat.block
};

export type ElementComponent = (props: RenderElementProps) => JSX.Element;

const elementComponents: Partial<Record<string, ElementComponent>> = {
  [EFormat.blockQuote]: ({ attributes, children, element }) => {
    return <blockquote {...attributes} {...eltRenderAttrs(element)}>{children}</blockquote>;
  },
  [EFormat.bulletedList]: ({ attributes, children, element }) => {
    return <ul {...attributes} {...eltRenderAttrs(element)}>{children}</ul>;
  },
  [EFormat.heading1]: ({ attributes, children, element }) => {
    return <h1 {...attributes} {...eltRenderAttrs(element)}>{children}</h1>;
  },
  [EFormat.heading2]: ({ attributes, children, element }) => {
    return <h2 {...attributes} {...eltRenderAttrs(element)}>{children}</h2>;
  },
  [EFormat.heading3]: ({ attributes, children, element }) => {
    return <h3 {...attributes} {...eltRenderAttrs(element)}>{children}</h3>;
  },
  [EFormat.heading4]: ({ attributes, children, element }) => {
    return <h4 {...attributes} {...eltRenderAttrs(element)}>{children}</h4>;
  },
  [EFormat.heading5]: ({ attributes, children, element }) => {
    return <h5 {...attributes} {...eltRenderAttrs(element)}>{children}</h5>;
  },
  [EFormat.heading6]: ({ attributes, children, element }) => {
    return <h6 {...attributes} {...eltRenderAttrs(element)}>{children}</h6>;
  },
  [EFormat.horizontalRule]: ({ attributes, children, element }) => {
    return <hr {...attributes} {...eltRenderAttrs(element)}>{children}</hr>;
  },
  [EFormat.listItem]: ({ attributes, children, element }) => {
    return <li {...attributes} {...eltRenderAttrs(element)}>{children}</li>;
  },
  [EFormat.numberedList]: ({ attributes, children, element }) => {
    return <ol {...attributes} {...eltRenderAttrs(element)}>{children}</ol>;
  },
  [EFormat.preformatted]: ({ attributes, children, element }) => {
    return <pre {...attributes} {...eltRenderAttrs(element)}>{children}</pre>;
  },
  [EFormat.block]: ({ attributes, children, element }) => {
    return <div {...attributes} {...eltRenderAttrs(element)}>{children}</div>;
  },
  [EFormat.horizontalRule]: ({ attributes, children, element }) => {
    return <hr {...attributes} {...eltRenderAttrs(element)}/>;
  }
};

export function registerElement(format: string, Component: ElementComponent) {
  elementComponents[format] = Component;
  
  elementTypeMap[format] = format; // FIXME. This doesn't work unless the html tag happens to match the type.
}

export const Element = (props: RenderElementProps) => {
  const { element: { type } } = props;
  const Component = elementComponents[type];
  if (Component) return <Component {...props}/>;

  // default to simple paragraph
  const { attributes, children, element } = props;
  return <p {...attributes} {...eltRenderAttrs(element)}>{children}</p>;
};