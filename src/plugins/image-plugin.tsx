import React from "react";
import classNames from "classnames/dedupe";
import { ReactEditor, RenderElementProps, useFocused, useSelected, useSlateStatic } from "slate-react";
import { CustomElement, EFormat, ImageElement } from "../common/slate-types";
import { useSerializing } from "../hooks/use-serializing";
import { IDialogController } from "../modal-dialog/dialog-types";
import { Editor, Transforms } from "slate";
import { isWebUri } from "valid-url";

import "./image-plugin.scss";
import { registerElement } from "../slate-editor/element";

const kImageNodeClass = "ccrte-image-node";
const kImageHighlightClass = "ccrte-image-highlight";
const kInlineBlockClass = "ccrte-inline-block";
const kImageNoConstrainClass = "ccrte-no-constrain";
const kFloatLeftClasses = ["ccrte-float-left", "tinymce-img-float-left"];
const kFloatRightClasses = ["ccrte-float-right", "tinymce-img-float-right"];
const kFloatValueToClassesMap: Record<string, string[]> = {
  left: kFloatLeftClasses,
  right: kFloatRightClasses
};
const getClassesForFloatValue = (float?: string) => {
  return float && kFloatValueToClassesMap[float] || undefined;
};

export const isImageElement = (element: CustomElement): element is ImageElement => {
  return element.type === EFormat.image;
};

export const ImageComponent = ({ attributes, children, element }: RenderElementProps) => {
  const isFocused = useFocused();
  const isSelected = useSelected();
  const isSerializing = useSerializing();

  const editor = isSerializing ? null : useSlateStatic();

  if (!isImageElement(element)) return null;

  const handleDoubleClick = () => {
    console.log('doubleclick image');
    editor?.emitEvent("toolbarDialog", element);
  };

  const onLoad = isSerializing ? undefined : () => null;
  const onDoubleClick = isSerializing ? undefined : handleDoubleClick;

  const { src, alt, width, height, constrain = true, float } = element;
  const highlightClass = isFocused && isSelected && !isSerializing ? kImageHighlightClass : undefined;
  const constrainClass = constrain ? undefined : kImageNoConstrainClass;
  const floatClasses = getClassesForFloatValue(float);
  const imgClasses = classNames(highlightClass, constrainClass, floatClasses) || undefined;
  const divClasses = kInlineBlockClass;
  return (
    isSerializing ? 
      <img className={imgClasses} src={src} alt={alt} title={alt} width={width} height={height}/>
    :
    <div {...attributes} className={`${kImageNodeClass} ${divClasses}`}>
      {children}
      <div className={divClasses} contentEditable={false}>
        <img className={imgClasses} src={src} alt={alt} title={alt} width={width} height={height}
            onLoad={onLoad} onDoubleClick={onDoubleClick}/>
      </div>
    </div>
  );
};

function getDialogValuesFromNode(node?: CustomElement) {
  const values: Record<string, string> = {};
  if (node && !isImageElement(node)) return {};

  node?.src && (values.source = node.src);
  node?.alt && (values.description = node.alt);
  node?.width && (values.width = node.width.toString());
  node?.height && (values.height = node.height.toString());

  if (node?.width && node?.height) {
    values.ratio = `${node.width / node.height}`;
  }
  values.constrain = node?.constrain === false ? "false" : "true";
  const floatValue = node?.float;
  values.placement = floatValue === "right"
                      ? "float-right"
                      : floatValue === "left"
                          ? "float-left"
                          : "inline";
  return values;
};

function getNodeFromDialogValues(values: Record<string, string>) {
  const { source, description, width, height, constrain, placement } = values;
  const floatMap: Record<string, ImageElement["float"]> = { "float-left": "left", "float-right": "right" };
  const imageElt: ImageElement = { type: EFormat.image, src: source, children: [{ text: "" }] };

  description && (imageElt.alt = description);
  width && (imageElt.width = parseFloat(width));
  height && (imageElt.height = parseFloat(height));
  (constrain === "false") && (imageElt.constrain = false);
  placement?.includes("float") && (imageElt.float = floatMap[placement]);

  return imageElt;
};

export function withImages(editor: Editor) : Editor {
  const { configureElement, isInline, isVoid } = editor;

  editor.isInline = element => (element.type === EFormat.image) || isInline(element);
  editor.isVoid = element => (element.type === EFormat.image) || isVoid(element);

  editor.configureElement = (format: string, controller: IDialogController, node?: CustomElement) => {
    if (format !== EFormat.image) {
      return configureElement(format, controller, node);
    }

    controller.display({
      title: "Insert Image",
      rows: [
        { name: "source", type: "input", label: "Image URL:" },
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
            controller.update({ width: `${width}`, height: `${height}`, ratio: `${ratio}` });
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
            controller.update({ width: `${widthPx}`, height: `${heightPx}` });
          }
          else if (widthPx !== parseFloat(value)) {
            controller.update({ width: `${widthPx}` });
          }
        }
        else if (name === "height") {
          const heightPx = Math.round(parseFloat(value));
          if (!heightPx) return false;
          const { ratio, constrain } = values;
          const _ratio = parseFloat(ratio);

          if ((constrain !== "false") && _ratio) {
            const widthPx = Math.round(heightPx * _ratio);
            controller.update({ width: `${widthPx}` });
          }
          else if (heightPx !== parseFloat(value)) {
            controller.update({ height: `${heightPx}` });
          }
        }
      },
      onValidate: (values) => isWebUri(values.source) ? values : "Error: please enter a properly formatted url",
      onAccept: (_editor, values) => {
        const imageElt = getNodeFromDialogValues(values);
        // if editing an existing node, remove the original before inserting the replacement
        const nodePath = node && ReactEditor.findPath(_editor, node);
        nodePath && Transforms.removeNodes(_editor, { at: nodePath });
        Transforms.insertNodes(_editor, imageElt, { select: node != null });
      },
      onClose: (_editor) => ReactEditor.focus(_editor)
    });
  };
  registerElement(EFormat.image, props => <ImageComponent {...props}/>);
  return editor;
};
