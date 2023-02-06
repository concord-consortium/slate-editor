import React from "react";
import { RenderElementProps } from "slate-react";
import { CustomElement } from "../common/custom-types";
import { getRenderAttributesFromNode } from "../serialization/html-utils";

export function eltRenderAttrs(element: CustomElement) {
  const eltAny = element as any;
  const align = eltAny.align ? { textAlign: eltAny.align } : undefined;
  return { ...align, ...getRenderAttributesFromNode(element) };
}

export type ElementComponent = (props: RenderElementProps) => JSX.Element;

const elementComponents: Record<string, ElementComponent> = {};

export function registerElementComponent(format: string, Component: ElementComponent) {
  elementComponents[format] = Component;
}

export const Element = ({ attributes, children: _children, element }: RenderElementProps) => {
  // console.log("rendering Element", "element:", JSON.stringify(element),
  //             "attributes:", JSON.stringify(attributes), "children:", JSON.stringify(_children));
  const { type, children: eltChildren, ...others } = element;
  const Component = elementComponents[type] ?? elementComponents.inline;
  const otherAttrs = elementComponents[type] ? undefined : { ...others };
  !elementComponents[type] && console.warn("Element:", "no component for:", type, "defaulting to `inline`");
  const children = Array.isArray(_children) && _children.length <= 1 ? _children[0] : _children;
  return <Component element={element} attributes={{...otherAttrs, ...attributes}}>{children}</Component>;
};
