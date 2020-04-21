import React from "react";
import { Editor, Plugin, RenderInlineProps } from "slate-react";
import { EFormat } from "../common/slate-types";
import { hasActiveInline } from "../slate-editor/slate-utils";

export function hasActiveLink(editor?: Editor) {
  return editor ? hasActiveInline(editor.value, EFormat.link) : false;
}

export function handleToggleLink(editor?: Editor) {
  if (!editor) return;
  const { value } = editor;
  const hasLink = hasActiveInline(editor.value, EFormat.link);

  function wrapLink(editor: Editor, href: string) {
    editor.wrapInline({
      type: EFormat.link,
      data: { href },
    });

    editor.moveToEnd();
  }

  function unwrapLink(editor: Editor) {
    editor.unwrapInline(EFormat.link);
  }

  if (hasLink) {
    editor.command(unwrapLink);
  } else if (value.selection.isExpanded) {
    const href = window.prompt('Enter the URL of the link:');
    if (!href) return;

    editor.command(wrapLink, href);
  } else {
    const href = window.prompt('Enter the URL of the link:');
    if (!href) return;

    const text = window.prompt('Enter the text for the link:');
    if (!text) return;

    editor
      .insertText(text)
      .moveFocusBackward(text.length)
      .command(wrapLink, href);
  }
}

export const linkPlugin: Plugin = {
  // eslint-disable-next-line react/display-name
  renderInline: (props: RenderInlineProps, editor: Editor, next: () => any) => {
    const { attributes, children, node } = props;
    if (node.type !== EFormat.link) return next();

    const { data } = node;
    const href: string = data.get('href');
    if (href.startsWith("codap:")) {
      const text = href.replace("codap:", "");
      return <a {...attributes}>{text}</a>;
    }
    return (
      <a {...attributes} href={href}>
        {children}
      </a>
    );
  }
};
