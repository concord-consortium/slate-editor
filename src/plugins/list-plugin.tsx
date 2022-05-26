/*
import React, { ReactNode } from "react";
import { Block } from "slate";
import { Editor, RenderAttributes, RenderBlockProps, EventHook } from "slate-react";
import { getRenderAttributesFromNode, getDataFromElement } from "../serialization/html-utils";
import { EFormat } from "../common/slate-types";
import { hasBlock, isBlockOfType } from "../slate-editor/slate-utils";
import { HtmlSerializablePlugin } from "./html-serializable-plugin";

function renderNodeAsTag(tag: string, node: Block, attributes: RenderAttributes,
                          children: ReactNode, isSerializing = false) {
  return React.createElement(tag, attributes, children);
}

const kTagToFormatMap: Record<string, string> = {
        li: EFormat.listItem,
        ol: EFormat.numberedList,
        ul: EFormat.bulletedList
      };

const kFormatToTagMap: Record<string, string> = {};

// build the kFormatToTagMap from the kTagToFormatMap
for (const tag in kTagToFormatMap) {
  const format = kTagToFormatMap[tag];
  kFormatToTagMap[format] = tag;
}

/**
 * On return/enter, navigate to next/previous cell if inside a table cell.
 *
 * @param {Event} event
 * @param {Editor} editor
 *\/

const handleEnter: EventHook<React.KeyboardEvent> = (event, editor, next) => {
  // For now, treat enter like tab. A more sophisticated implementation would
  // advance to the next/previous row rather than to the next cell, but that
  // is trickier to figure out.
  // return handleTab(event, editor, next);
  return next();
};

function isListOfTypeSelected(editor: Editor, format: EFormat) {
  const { value: { blocks, document } } = editor;
  return blocks.some(block =>
    !!block &&!!document.getClosest(block.key, parent => isBlockOfType(parent, format))
  );
}

export function ListPlugin(): HtmlSerializablePlugin {
  return {
    deserialize: function(el, next) {
      const tag = el.tagName.toLowerCase();
      const format = kTagToFormatMap[tag];
      if (format) {
        return {
          object: "block",
          type: format,
          ...getDataFromElement(el),
          nodes: next(el.childNodes),
        };
      }
    },
    serialize: function(obj, children) {
      const { object, type } = obj;
      const format = type;
      const tag = kFormatToTagMap[format];
      if (tag && (object === "block")) {
        const node: Block = obj;
        const attributes = getRenderAttributesFromNode(node);
        return renderNodeAsTag(tag, node, attributes, children, true);
      }
    },

    onCommand(command, editor, next) {
      const { type, args } = command;
      if (type === "toggleBlock") {
        const format = args?.[0];
        const containsListItems = hasBlock(editor.value, EFormat.listItem);
        if ((format === EFormat.bulletedList) || (format === EFormat.numberedList)) {
          const isListOfThisType = isListOfTypeSelected(editor, format);
          if (!containsListItems) {
            // For a brand new list, first set the selection to be a list-item.
            // Then wrap the new list-items with the appropriate type of block.
            editor.setBlocks(EFormat.listItem)
                  .wrapBlock(format);
          } else if (isListOfThisType) {
            // If we are setting a list to its current type, we treat this as
            // a toggle-off. To do this, we unwrap the selection and remove all
            // list-items.
            editor.setBlocks(EFormat.defaultBlock)  // Removes blocks typed w/ "list-item"
                  .unwrapBlock(EFormat.bulletedList)
                  .unwrapBlock(EFormat.numberedList);
          } else {
            // If we have ended up here, then we are switching a list between slate
            // types, i.e., bulleted <-> numbered.
            editor.unwrapBlock(format === EFormat.bulletedList ? EFormat.numberedList : EFormat.bulletedList)
                  .wrapBlock(format);
          }
          return;
        }
        else {
          if (containsListItems) {
            // In this case, we are trying to change a block away from
            // being a list. To do this, we either set the slateType we are
            // after, or clear it, if it's already set to that slateType. Then
            // we remove any part of the selection that might be a wrapper
            // of either type of list.
            editor.unwrapBlock(EFormat.bulletedList)
                  .unwrapBlock(EFormat.numberedList);
          }
        }
      }
      return next();
    },

    onKeyDown: (event, editor, next) => {
      switch (event.key) {
        case 'Enter':
          return handleEnter(event, editor, next);
        default:
          return next();
      }
    },

    renderBlock: (props: RenderBlockProps, editor: Editor, next: () => any) => {
      const { attributes, children, node } = props;
      const tag = kFormatToTagMap[node.type];
      return tag
              ? renderNodeAsTag(tag, node, { ...getRenderAttributesFromNode(node), ...attributes }, children)
              : next();
    }

  };
}
*/
