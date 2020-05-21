import React from "react";
import { Editor, Plugin, RenderInlineProps } from "slate-react";
import { EFormat } from "../common/slate-types";
import { hasActiveInline } from "../slate-editor/slate-utils";
import { DisplayDialogFunction } from "../slate-toolbar/slate-toolbar";

export const imagePlugin: Plugin = {
  queries: {
    isImageActive: function(editor: Editor) {
      return hasActiveInline(editor.value, EFormat.image);
    },
    isImageEnabled: function(editor: Editor) {
      return (editor.value.blocks.size <= 1) && (editor.value.inlines.size === 0);
    }
  },
  commands: {
    configureImage: function (editor: Editor, displayDialog: DisplayDialogFunction) {
      displayDialog({
        title: "Insert Image",
        prompts: ["Enter the URL of the image:"],
        onAccept: (_editor, inputs) => _editor.command("addImage", inputs)
      });
      return editor;
    },
    addImage: function (editor: Editor, dialogValues: string[]) {
      const src = dialogValues[0];
      if (!editor) return editor;
      if (!src) return editor;
      editor.insertInline({
        type: EFormat.image,
        data: { src }
      });
      return editor;
    },
  },
  schema: {
    inlines: {
      image: {
        isVoid: true,
      }
    }
  },
  // eslint-disable-next-line react/display-name
  renderInline: (props: RenderInlineProps, editor: Editor, next: () => any) => {
    const { attributes, node } = props;
    if (node.type !== EFormat.image) return next();
    const { data } = node;
    const src: string = data.get("src");
    const style = {boxShadow: (props.isSelected || props.isFocused) ? "0 0 0 2px lightskyblue" : "none"};
    return (
      <img onClick={() => editor.moveFocusToStartOfNode(node)} src={src} style={style} {...attributes}/>
    );
  }
};
