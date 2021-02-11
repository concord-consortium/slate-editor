import React, { ReactNode } from "react";
import { Inline } from "slate";
import { Editor, RenderAttributes, RenderInlineProps } from "slate-react";
import { EFormat } from "../common/slate-types";
import { getRenderAttributesFromNode, getDataFromElement } from "../serialization/html-utils";
import { hasActiveInline } from "../slate-editor/slate-utils";
import { IField, IFieldValues } from "../slate-toolbar/modal-dialog";
import { IDialogController } from "../slate-toolbar/slate-toolbar";
import { HtmlSerializablePlugin } from "./html-serializable-plugin";

function renderLink(link: Inline, attributes: RenderAttributes, children: ReactNode, isSerializing = false) {
  const { data } = link;
  const href: string = data.get('href');
  const target = isSerializing ? undefined : "_blank";
  const rel = isSerializing ? undefined : "noopener noreferrer";
  const onDoubleClick = isSerializing ? undefined : () => window.open(href);
  return (
    <a {...attributes} href={href} target={target} rel={rel} onDoubleClick={onDoubleClick}>
      {children}
    </a>
  );
}

const kLinkTag = "a";

export function LinkPlugin(): HtmlSerializablePlugin {
  return {
    deserialize: function(el, next) {
      if (el.tagName.toLowerCase() === kLinkTag) {
        const data = getDataFromElement(el);
        return {
          object: "inline",
          type: EFormat.link,
          ...data,
          nodes: next(el.childNodes),
        };
      }
    },
    serialize: function(obj, children) {
      const { object, type } = obj;
      if ((object === "inline") && (type === EFormat.link)) {
        const link: Inline = obj;
        return renderLink(link, getRenderAttributesFromNode(link), children, true);
      }
    },

    queries: {
      isLinkActive: function(editor: Editor) {
        return hasActiveInline(editor.value, EFormat.link);
      },
      isLinkEnabled: function(editor: Editor) {
                // must be in a single block
        return (editor.value.blocks.size <= 1) &&
                // must have no selected inlines (click will insert link)
                ((editor.value.inlines.size === 0) ||
                // or have exactly one inline link selected (click will de-link)
                ((editor.value.inlines.size === 1) &&
                  editor.value.inlines.every(inline => inline?.type === EFormat.link)));
      }
    },
    commands: {
      wrapLink: function (editor: Editor, href: string) {
        editor.wrapInline({
          type: EFormat.link,
          data: { href },
        });
        editor.moveToEnd();
        return editor;
      },
      configureLink: function (editor: Editor, dialogController: IDialogController) {
        const { value } = editor;
        const hasLink = hasActiveInline(editor.value, EFormat.link);

        function unwrapLink(_editor: Editor) {
          _editor.unwrapInline(EFormat.link);
        }

        if (hasLink) {
          editor.command(unwrapLink);
        } else {
          const textField: IField[] = value.selection.isExpanded
                                        ? []
                                        : [{ name: "linkText", type: "input",
                                            label: "Link text:" }];
          const urlField: IField[] = [{ name: "linkUrl", type: "input",
                                      label: "Link URL:" }];
          const linkCmd = value.selection.isExpanded ? "applyLink" : "insertLink";
          dialogController.display({
            title: "Insert Link",
            rows: [...textField, ...urlField],
            values: {},
            onAccept: (_editor, inputs) => _editor.command(linkCmd, inputs)
          });
        }
        return editor;
      },
      insertLink: function (editor: Editor, values: IFieldValues) {
        const text = values.linkText;
        const href = values.linkUrl;
        editor
          .insertText(text)
          .moveFocusBackward(text.length)
          .command("wrapLink", href);
        return editor;
      },
      applyLink: function (editor: Editor, values: IFieldValues) {
        const href = values.linkUrl;
        editor.command("wrapLink", href);
        return editor;
      }
    },
    renderInline: (props: RenderInlineProps, editor: Editor, next: () => any) => {
      const { attributes, children, node } = props;
      return node.type === EFormat.link
              ? renderLink(node, { ...getRenderAttributesFromNode(node), ...attributes }, children)
              : next();
    }
  };
}
