import React from "react";
import { Editor, Plugin, RenderInlineProps } from "slate-react";
import { EFormat } from "../common/slate-types";
import { hasActiveInline } from "../slate-editor/slate-utils";
import { DisplayDialogFunction } from "../slate-toolbar/slate-toolbar";

export const linkPlugin: Plugin = {
  queries: {
    isLinkActive: function(editor: Editor) {
      return hasActiveInline(editor.value, EFormat.link);
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
    configureLink: function (editor: Editor, displayDialog: DisplayDialogFunction) {
      const { value } = editor;
      const hasLink = hasActiveInline(editor.value, EFormat.link);

      function unwrapLink(_editor: Editor) {
        _editor.unwrapInline(EFormat.link);
      }

      if (hasLink) {
        editor.command(unwrapLink);
      } else {
        const textPrompt = value.selection.isExpanded ? [] : ["Enter the text for the link:"];
        const linkCmd = value.selection.isExpanded ? "applyLink" : "insertLink";
        displayDialog({
          title: "Insert Link",
          prompts: [...textPrompt, "Enter the URL of the link:"],
          onAccept: (_editor, inputs) => _editor.command(linkCmd, inputs)
        });
}
      return editor;
    },
    insertLink: function (editor: Editor, dialogValues: string[]) {
      const text = dialogValues[0];
      const href = dialogValues[1];
      editor
        .insertText(text)
        .moveFocusBackward(text.length)
        .command("wrapLink", href);
      return editor;
    },
    applyLink: function (editor: Editor, dialogValues: string[]) {
      const href = dialogValues[0];
      editor.command("wrapLink", href);
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
