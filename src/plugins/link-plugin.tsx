import React from "react";
import { Editor, Plugin, RenderInlineProps } from "slate-react";
import { EFormat } from "../common/slate-types";
import { hasActiveInline } from "../slate-editor/slate-utils";

export const linkPlugin: Plugin = {
  queries: {
    isLinkActive: function(editor: Editor) {
      return hasActiveInline(editor.value, EFormat.link);
    }
  },
  commands: {
    toggleLink: function (editor: Editor) {
      const { value } = editor;
      const hasLink = hasActiveInline(editor.value, EFormat.link);

      function wrapLink(_editor: Editor, href: string) {
        _editor.wrapInline({
          type: EFormat.link,
          data: { href },
        });

        _editor.moveToEnd();
      }

      function unwrapLink(_editor: Editor) {
        _editor.unwrapInline(EFormat.link);
      }

      if (hasLink) {
        editor.command(unwrapLink);
      } else if (value.selection.isExpanded) {
        const href = window.prompt('Enter the URL of the link:');
        if (!href) return editor;

        editor.command(wrapLink, href);
      } else {
        const href = window.prompt('Enter the URL of the link:');
        if (!href) return editor;

        const text = window.prompt('Enter the text for the link:');
        if (!text) return editor;

        editor
          .insertText(text)
          .moveFocusBackward(text.length)
          .command(wrapLink, href);
      }
      return editor;
    }
  },
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
