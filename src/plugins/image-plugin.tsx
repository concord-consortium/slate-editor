import React from "react";
import { Editor, Plugin, RenderInlineProps } from "slate-react";
import { EFormat } from "../common/slate-types";

export const imagePlugin: Plugin = {
  commands: {
    addImage: function (editor: Editor) {
      if (!editor) return editor;
      const src = window.prompt("Enter the URL of the image:");
      if (!src) return editor;
      editor.insertInline({
        type: EFormat.image,
        data: { src }
      })      
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
    const { attributes, children, node } = props;
    if (node.type !== EFormat.image) return next();
    const { data } = node;
    const src: string = data.get("src");
    const style = {boxShadow: (props.isSelected || props.isFocused) ? "0 0 0 2px lightskyblue" : "none"};
    return (
      <img onClick={() => editor.moveFocusToStartOfNode(node)} src={src} style={style} {...attributes}/>  
    );
  }  
};
