import React, { useContext } from "react";
import { Editor, Range } from "slate";
import { RenderElementProps } from "slate-react";
import { isWebUri } from "valid-url";
import { CustomElement, LinkElement } from "../common/custom-types";
import { IsSerializingContext } from "../common/is-serializing-context";
import { EFormat } from "../common/slate-types";
import { unwrapElement, wrapElement } from "../common/slate-utils";
import { IDialogController, IField } from "../modal-dialog/dialog-types";
import { registerElementRenderFn } from "../slate-editor/element";

export const isLinkElement = (element: CustomElement): element is LinkElement => {
  return element.type === EFormat.link;
};

// Put this at the start and end of an inline component to work around this Chromium bug:
// https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
const InlineChromiumBugfix = () => <span contentEditable={false} style={{ fontSize: 0 }}>{"\u00a0"}</span>;

export const LinkInline = ({ attributes, children, element }: RenderElementProps) => {
  const isSerializing = useContext(IsSerializingContext);

  if (!isLinkElement(element)) return null;

  const { href } = element;
  const target = isSerializing ? undefined : "_blank";
  const rel = isSerializing ? undefined : "noopener noreferrer";
  const onDoubleClick = isSerializing ? undefined : () => window.open(href);
  return (
    <a {...attributes} href={href} target={target} rel={rel} onDoubleClick={onDoubleClick}>
      <InlineChromiumBugfix/>
      {children}
      <InlineChromiumBugfix/>
    </a>
  );
};

// const kLinkTag = "a";

export function withLinkInlines(editor: Editor) {
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

  editor.configureElement = (format: string, controller: IDialogController) => {
    if (format !== EFormat.link) return configureElement(format, controller);

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

      controller.display({
        title: "Insert Link",
        rows: [...textField, ...urlField],
        values: {},
        onValidate: (values) => isWebUri(values.linkUrl) ? values : "Error: please enter a properly formatted url",
        onAccept: (_editor, inputs) => wrapElement(_editor, EFormat.link, { href: inputs.linkUrl }, inputs.linkText)
      });
    }
  };

  registerElementRenderFn(EFormat.link, props => <LinkInline {...props}/>);

  return editor;

  // return {
  //   deserialize: function(el, next) {
  //     if (el.tagName.toLowerCase() === kLinkTag) {
  //       const data = getDataFromElement(el);
  //       return {
  //         object: "inline",
  //         type: EFormat.link,
  //         ...data,
  //         nodes: next(el.childNodes),
  //       };
  //     }
  //   },
  //   serialize: function(obj, children) {
  //     const { object, type } = obj;
  //     if ((object === "inline") && (type === EFormat.link)) {
  //       const link: Inline = obj;
  //       return renderLink(link, getRenderAttributesFromNode(link), children, true);
  //     }
  //   },
}
