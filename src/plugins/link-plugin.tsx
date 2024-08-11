import React from "react";
import { Descendant, Editor, Range } from "slate";
import { jsx } from "slate-hyperscript";
import { RenderElementProps } from "slate-react";
import { isWebUri } from "valid-url";
import IconLink from "../assets/icon-link";
import { CustomElement, LinkElement } from "../common/custom-types";
import { getDialogController, getPlatformTooltip, registerToolbarButtons } from "../common/toolbar-utils";
import { useSerializing } from "../hooks/use-serializing";
import { EFormat } from "../common/slate-types";
import { unwrapElement, wrapElement } from "../common/slate-utils";
import { IDialogController, IField } from "../modal-dialog/dialog-types";
import { registerElementDeserializer } from "../serialization/html-serializer";
import { getElementAttrs } from "../serialization/html-utils";
import { eltRenderAttrs, registerElementComponent } from "../slate-editor/element";

export const isLinkElement = (element: CustomElement): element is LinkElement => {
  return element.type === EFormat.link;
};

// Put this at the start and end of an inline component to work around this Chromium bug:
// https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
const InlineChromiumBugfix = () => <span contentEditable={false} style={{ fontSize: 0 }}>{"\u00a0"}</span>;

export const LinkComponent = ({ attributes, children, element }: RenderElementProps) => {
  const isSerializing = useSerializing();

  if (!isLinkElement(element)) return null;

  const { href } = element;
  const target = isSerializing ? undefined : "_blank";
  const rel = isSerializing ? undefined : "noopener noreferrer";
  const onDoubleClick = isSerializing ? undefined : () => window.open(href);
  return (
    <a {...attributes} {...eltRenderAttrs(element)} href={href} target={target} rel={rel} onDoubleClick={onDoubleClick}>
      {!isSerializing && <InlineChromiumBugfix/>}
      {children}
      {!isSerializing && <InlineChromiumBugfix/>}
    </a>
  );
};

const kLinkTag = "a";

let isRegistered = false;

export function registerLinkInline() {
  if (isRegistered) return;

  registerElementComponent(EFormat.link, props => <LinkComponent {...props}/>);
  registerElementDeserializer(kLinkTag, {
    deserialize: (el: HTMLElement, children: Descendant[]) => {
      const { href } = el as HTMLAnchorElement;
      const attrs = href ? { href } : undefined;
      return jsx("element", { type: EFormat.link, ...attrs, ...getElementAttrs(el, ["href"]) }, children);
    }
  });

  isRegistered = true;
}

export function withLinkInline(editor: Editor) {
  registerLinkInline();

  registerToolbarButtons(editor, [{
    format: EFormat.link,
    SvgIcon: IconLink,
    tooltip: getPlatformTooltip("link"),
    isActive: () => editor.isElementActive(EFormat.link),
    isEnabled: () => editor.isElementEnabled(EFormat.link),
    onClick: () => editor.configureElement(EFormat.link, getDialogController(editor))
  }]);

  const { configureElement, isElementEnabled, isInline } = editor;

  editor.isInline = element => (element.type === EFormat.link) || isInline(element);

  editor.isElementEnabled = format => {
    if (format !== EFormat.link) return isElementEnabled(format);

    let blocks = 0, inlines = 0, links = 0;

    const elements = editor.selectedElements();
    elements.forEach(elt => {
      editor.isInline(elt) ? ++inlines : ++blocks;
      isLinkElement(elt) && ++links;
    });

    // must be within a single block and no more than one inline/link selected
    return (blocks <= 1) && ((inlines === 0) || (inlines === 1 && links === 1));
  };

  editor.configureElement = (format: string, controller?: IDialogController, node?: CustomElement) => {
    if (format !== EFormat.link) return configureElement(format, controller, node);

    const { selection } = editor;
    const isCollapsed = selection && Range.isCollapsed(selection);
    const hasLink = editor.isElementActive(EFormat.link);

    if (hasLink) {
      unwrapElement(editor, EFormat.link);
    } else {
      const textField: IField[] = isCollapsed
                                    ? [{ name: "linkText", type: "input", label: "Link text:" }]
                                    : [];
      const urlField: IField[] = [{ name: "linkUrl", type: "input", label: "Link URL:" }];

      controller?.display({
        title: "Insert Link",
        rows: [...textField, ...urlField],
        values: {},
        onValidate: (values) => isWebUri(values.linkUrl) ? values : "Error: please enter a properly formatted url",
        onAccept: (_editor, inputs) => wrapElement(_editor, EFormat.link, { href: inputs.linkUrl }, inputs.linkText)
      });
    }
  };

  return editor;
}
