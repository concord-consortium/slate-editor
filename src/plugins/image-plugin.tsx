import React, { ReactNode } from "react";
import classNames from "classnames";
import clone from "lodash/clone";
import { Inline } from "slate";
import { Editor, RenderAttributes, RenderInlineProps } from "slate-react";
import { EFormat } from "../common/slate-types";
import { hasActiveInline } from "../slate-editor/slate-utils";
import { IFieldValues } from "../slate-toolbar/modal-dialog";
import { IDialogController } from "../slate-toolbar/slate-toolbar";
import { getDataFromElement, getRenderAttributesFromNode, classArray } from "../serialization/html-utils";
import { HtmlSerializablePlugin } from "./html-serializable-plugin";
import "./image-plugin.scss";

const kImageHighlightClass = "ccse-image-highlight";

interface IRenderOptions {
  isSerializing?: boolean;
  isHighlighted?: boolean;
  onLoad?: () => void;
  onClick?: () => void;
  onDoubleClick?: () => void;
}
function renderImage(node: Inline, attributes: RenderAttributes, children: ReactNode, options?: IRenderOptions) {
  const { data } = node;
  const { className, ...otherAttributes } = attributes;
  const highlightClass = options?.isHighlighted && !options?.isSerializing ? kImageHighlightClass : undefined;
  const src: string = data.get("src");
  const alt: string = data.get("alt");
  const width: number = data.get("width");
  const height: number = data.get("height");
  const constrain: boolean = data.get("constrain") !== false;
  const constrainClass = constrain ? undefined : "ccse-no-constrain";
  const floatClassMap: Record<string, string[]> = {
          "left": ["ccse-float-left", "tinymce-img-float-left"],
          "right": ["ccse-float-right", "tinymce-img-float-right"]
        };
  const float = data.get("float");
  const floatClasses = float ? floatClassMap[float] : undefined;
  const classes = classNames(classArray(className), highlightClass, constrainClass, floatClasses) || undefined;
  const onLoad = options?.isSerializing ? undefined : options?.onLoad;
  const onClick = options?.isSerializing ? undefined : options?.onClick;
  const onDoubleClick = options?.isSerializing ? undefined : options?.onDoubleClick;
  return (
    <img className={classes} src={src} alt={alt} title={alt} width={width} height={height}
        onLoad={onLoad} onClick={onClick} onDoubleClick={onDoubleClick} {...otherAttributes}/>
  );
}

function getDataFromImageElement(el: Element) {
  const { data } = getDataFromElement(el);
  const _data: Record<string, string | number | boolean> = clone(data) || {};
  const _classes = data?.["class"] || "";
  if (data?.width) {
    _data.width = Math.round(parseFloat(data.width));
  }
  if (data?.height) {
    _data.height = Math.round(parseFloat(data.height));
  }
  if (_classes.includes("ccse-no-constrain")) {
    _data.constrain = false;
  }
  if (_classes.includes("ccse-float-left") || _classes.includes("tinymce-img-float-left")) {
    _data.float = "left";
  }
  if (_classes.includes("ccse-float-right") || _classes.includes("tinymce-img-float-right")) {
    _data.float = "right";
  }
  return { data: _data };
}

function getDialogValuesFromNode(node?: Inline) {
  const values: Record<string, string> = {};
  const { data } = node || {};
  let source, alt, width, height;
  if ((source = data?.get("src"))) {
    values.source = source;
  }
  if ((alt = data?.get("alt"))) {
    values.description = alt;
  }
  if ((width = data?.get("width"))) {
    values.width = width;
  }
  if ((height = data?.get("height"))) {
    values.height = height;
  }
  if (width && height) {
    values.ratio = `${parseFloat(width) / parseFloat(height)}`;
  }
  const _class = data?.get("class") || "";
  values.constrain = _class.includes("ccse-no-constrain") ? "false" : "true";
  values.placement = _class.includes("ccse-float-right") || _class.includes("tinymce-img-float-right")
                      ? "float-right"
                      : _class.includes("ccse-float-left") || _class.includes("tinymce-img-float-left")
                          ? "float-left"
                          : "inline";
  return values;
}

const kImageTag = "img";

export function ImagePlugin(): HtmlSerializablePlugin {
  return {
    deserialize: function(el, next) {
      if (el.tagName.toLowerCase() === kImageTag) {
        const data = getDataFromImageElement(el);
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
      configureImage: function (editor: Editor, dialogController: IDialogController, node?: Inline) {
        dialogController.display({
          title: "Insert Image",
          rows: [
            { name: "source", type: "input", label: "Source URL:" },
            { name: "description", type: "input", label: "Description:" },
            { name: "dimensions", type: "label", label: "Dimensions:" },
            [
              { name: "width", type: "input", charSize: 6 },
              { name: "x", type: "label", label: "x" },
              { name: "height", type: "input", charSize: 6 },
              { name: "units", type: "label", label: "px\u00a0\u00a0\u00a0\u00a0" },
              { name: "constrain", type: "checkbox", label: "Constrain proportions" },
            ],
            {
              name: "placement", type: "select", label: "Placement:",
              options: [
                { value: "inline", label: "Inline" },
                { value: "float-left", label: "Float left" },
                { value: "float-right", label: "Float right" },
              ]
            }
          ],
          values: getDialogValuesFromNode(node),
          onChange: (_editor, name, value, values) => {
            if (name === "source") {
              // determine image size
              const img = new Image();
              img.onload = () => {
                const width = img.naturalWidth;
                const height = img.naturalHeight;
                const ratio = width / height;
                dialogController.update({ width: `${width}`, height: `${height}`, ratio: `${ratio}` });
              };
              img.src = values.source;
            }
            else if (name === "width") {
              const widthPx = Math.round(parseFloat(value));
              if (!widthPx) return false;
              const { ratio, constrain } = values;
              const _ratio = parseFloat(ratio);

              if ((constrain !== "false") && _ratio) {
                const heightPx = Math.round(widthPx / _ratio);
                dialogController.update({ width: `${widthPx}`, height: `${heightPx}` });
              }
              else if (widthPx !== parseFloat(value)) {
                dialogController.update({ width: `${widthPx}` });
              }
            }
            else if (name === "height") {
              const heightPx = Math.round(parseFloat(value));
              if (!heightPx) return false;
              const { ratio, constrain } = values;
              const _ratio = parseFloat(ratio);

              if ((constrain !== "false") && _ratio) {
                const widthPx = Math.round(heightPx * _ratio);
                dialogController.update({ width: `${widthPx}`});
              }
              else if (heightPx !== parseFloat(value)) {
                dialogController.update({ height: `${heightPx}` });
              }
            }
          },
          onAccept: (_editor, values) => _editor.command("addImage", values, node)
        });
        return editor;
      },
      addImage: function (editor: Editor, values: IFieldValues, node?: Inline) {
        const { source, description, width, height, constrain, placement } = values;
        if (!editor || !source) return editor;
        const alt = description
                      ? { alt: description }
                      : undefined;
        const w = Math.round(parseFloat(width));
        const h = Math.round(parseFloat(height));
        const size = w & h
                      ? { width: w, height: h }
                      : undefined;
        const _constrain = constrain === "false"
                            ? { constrain: false }
                            : undefined;
        const floatMap: Record<string, string> = { "float-left": "left", "float-right": "right" };
        const float = placement?.includes("float")
                        ? { float: floatMap[placement] }
                        : undefined;
        if (node) {
          editor.moveToStartOfNode(node)
                .deleteForward();
        }
        editor.insertInline({
          type: EFormat.image,
          data: { src: source, ...alt, ...size, ..._constrain, ...float }
        });
        return editor;
      },
    },
    schema: {
      inlines: {
        image: {
          isVoid: true
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
              onClick: () => editor.moveFocusToStartOfNode(node),
              onDoubleClick: () => editor.command("emit", "configureImage", node)
            };
      return renderImage(node, { ...dataAttrs, ...attributes }, children, options);
    }
  };
}
