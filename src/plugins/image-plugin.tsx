import React, { ReactNode } from "react";
import { Inline } from "slate";
import { Editor, RenderAttributes, RenderInlineProps } from "slate-react";
import { EFormat } from "../common/slate-types";
import { hasActiveInline } from "../slate-editor/slate-utils";
import { DisplayDialogFunction } from "../slate-toolbar/slate-toolbar";
import { getDataFromElement, getRenderAttributesFromNode, mergeClassStrings } from "../serialization/html-utils";
import { HtmlSerializablePlugin } from "./html-serializable-plugin";
import "./image-plugin.scss";

const kImageHighlightClass = "cc-image-highlight";

interface IRenderOptions {
  isSerializing?: boolean;
  isHighlighted?: boolean;
  onLoad?: () => void;
  onClick?: () => void;
}
function renderImage(node: Inline, attributes: RenderAttributes, children: ReactNode, options?: IRenderOptions) {
  const { data } = node;
  const highlightClass = options?.isHighlighted && !options?.isSerializing ? kImageHighlightClass : undefined;
  const classes = mergeClassStrings(highlightClass, attributes.className);
  const src: string = data.get("src");
  const onLoad = options?.isSerializing ? undefined : options?.onLoad;
  const onClick = options?.isSerializing ? undefined : options?.onClick;
  return (
    <img className={classes} src={src} onClick={onClick} onLoad={onLoad} {...attributes}/>
  );
}

const kImageTag = "img";

export function ImagePlugin(): HtmlSerializablePlugin {
  return {
    deserialize: function(el, next) {
      if (el.tagName.toLowerCase() === kImageTag) {
        const data = getDataFromElement(el);
        return {
          object: "inline",
          type: EFormat.image,
          ...data,
          nodes: next(el.childNodes),
        };
      }
    },
    serialize: function(obj, children) {
      const { object, type } = obj;
      if ((object === "inline") && (type === EFormat.image)) {
        const image: Inline = obj;
        return renderImage(image, getRenderAttributesFromNode(image), children, { isSerializing: true });
      }
    },

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

    renderInline: (props: RenderInlineProps, editor: Editor, next: () => any) => {
      const { attributes, node, children } = props;
      if (node.type !== EFormat.image) return next();
      const dataAttrs = getRenderAttributesFromNode(node);

      const options: IRenderOptions = {
              isSerializing: false,
              isHighlighted: props.isSelected || props.isFocused,
              onLoad: () => editor.command("onLoad", node),
              onClick: () => editor.moveFocusToStartOfNode(node)
            };
      return renderImage(node, { ...dataAttrs, ...attributes }, children, options);
    }
  };
}
