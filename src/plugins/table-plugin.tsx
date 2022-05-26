/*
import React, { ReactNode } from "react";
import { Block, Node } from "slate";
import { Editor, RenderAttributes, RenderBlockProps, EventHook } from "slate-react";
import { getRenderAttributesFromNode, getDataFromElement } from "../serialization/html-utils";
import { HtmlSerializablePlugin } from "./html-serializable-plugin";

function renderNodeAsTag(tableTag: string, node: Block, attributes: RenderAttributes,
                          children: ReactNode, isSerializing = false) {
  // <col> tags can't have children
  const _children = tableTag === "col" ? null : children;
  return React.createElement(tableTag, attributes, _children);
}

const kTagToFormatMap: Record<string, string> = {
        table: "table",
        caption: "table-caption",
        colgroup: "table-column-group",
        col: "table-column",
        thead: "table-header",
        tbody: "table-body",
        tr: "table-row",
        th: "table-header-cell",
        td: "table-cell",
        tfoot: "table-footer"
      };

const kFormatToTagMap: Record<string, string> = {};

// build the kFormatToTagMap from the kTagToFormatMap
for (const tag in kTagToFormatMap) {
  const format = kTagToFormatMap[tag];
  kFormatToTagMap[format] = tag;
}

function isTableCell(node?: Node | null) {
  return (node?.object === "block") && ((node?.type === "table-cell") || (node?.type === "table-header-cell"));
}

interface ISelectionInfo {
  selectedBlocks: number;
  selectedCells: number;
}

function getSelectionInfo(editor: Editor): ISelectionInfo {
  const { blocks } = editor.value;
  let selectedCells = 0;
  blocks.forEach(node => isTableCell(node) && ++selectedCells);
  return { selectedBlocks: blocks.size, selectedCells };
}

function isCaretAtStart(editor: Editor) {
  const { document, selection: { isCollapsed, start } } = editor.value;
  const startNode = isCollapsed && document.getDescendant(start.key);
  return !!startNode && start.isAtStartOfNode(startNode);
}

function isCaretAtEnd(editor: Editor) {
  const { document, selection: { isCollapsed, end } } = editor.value;
  const endNode = isCollapsed && document.getDescendant(end.key);
  return !!endNode && end.isAtEndOfNode(endNode);
}

// returns true if an expanded selection could be normalized for editing
// returns false if an expanded selection should not allow editing
// returns undefined if this function has no opinion (collapsed selection, not a table cell, etc.)
function normalizeExpandedSelection(editor: Editor) {
  const { document, selection: { isExpanded, start, end } } = editor.value;
  if (!isExpanded) return undefined;
  const { selectedBlocks, selectedCells } = getSelectionInfo(editor);
  if (selectedCells === 0) return undefined;
  if ((selectedCells === 1) && (selectedBlocks === 1)) return true;
  if (selectedBlocks > 2) return false;
  const startNode = document.getDescendant(start.key);
  const endNode = document.getDescendant(end.key);
  if ((selectedBlocks === 2) && startNode && endNode && end.isAtStartOfNode(endNode)) {
    editor.select(editor.value.selection.moveEndToEndOfNode(startNode));
    return true;
  }
  return false;
}

function prevTableCell(editor: Editor) {
  const { value: { document, selection: { start } } } = editor;
  const startNode = document.getDescendant(start.key);
  const prevText = startNode && document.getPreviousText(startNode.key);
  const prevBlock = prevText && document.getClosestBlock(prevText.key);
  return prevBlock && isTableCell(prevBlock) ? prevBlock : undefined;
}

function nextTableCell(editor: Editor) {
  const { value: { document, selection: { end } } } = editor;
  const endNode = document.getDescendant(end.key);
  const endText = endNode && document.getNextText(endNode.key);
  const nextBlock = endText && document.getClosestBlock(endText.key);
  return nextBlock && isTableCell(nextBlock) ? nextBlock : undefined;
}

/**
 * On tab, navigate to next/previous cell if inside a table cell.
 *
 * @param {Event} event
 * @param {Editor} editor
 *\/

const handleTab: EventHook<React.KeyboardEvent> = (event, editor, next) => {
  const { selectedCells } = getSelectionInfo(editor);
  if (selectedCells) {
    const tabCell = event.shiftKey ? prevTableCell(editor) : nextTableCell(editor);
    tabCell && editor.moveToRangeOfNode(tabCell);
    event.preventDefault();
  }
  else {
    next();
  }
};

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
  return handleTab(event, editor, next);
};

/**
 * On backspace, do nothing if at the start of a table cell.
 *
 * @param {Event} event
 * @param {Editor} editor
 *\/
const handleBackspace: EventHook<React.KeyboardEvent> = (event, editor, next) => {
  const { value } = editor;
  const { selection } = value;
  const { isCollapsed } = selection;
  const { selectedBlocks, selectedCells } = getSelectionInfo(editor);
      // can backspace outside a table unless the caret is immediately after a table
  if (((selectedCells === 0) && !(isCaretAtStart(editor) && prevTableCell(editor))) ||
      // can delete the text inside a table cell, but not beyond the cell
      ((selectedCells === 1) && (selectedBlocks === 1) &&
        (!isCollapsed || (selection.start.offset !== 0))) ||
      // can delete text in a cell if an expanded selection can be normalized to one cell
      normalizeExpandedSelection(editor)) {
    return next();
  }
  // also can't delete if more than one cell is selected
  event.preventDefault();
};

/**
 * On delete, do nothing if at the end of a table cell.
 *
 * @param {Event} event
 * @param {Editor} editor
 *\/
const handleDelete: EventHook<React.KeyboardEvent> = (event, editor, next) => {
  const { value } = editor;
  const { selection } = value;
  const { isCollapsed } = selection;
  const { selectedBlocks, selectedCells } = getSelectionInfo(editor);
      // can delete outside a table unless the caret is immediately before a table
  if (((selectedCells === 0) && !(isCaretAtEnd(editor) && nextTableCell(editor))) ||
      // can delete the text inside a table cell, but not beyond the cell
      ((selectedCells === 1) && (selectedBlocks === 1) &&
        (!isCollapsed || (selection.end.offset !== value.startText.text.length))) ||
      // can delete text in a cell if an expanded selection can be normalized to one cell
      normalizeExpandedSelection(editor)) {
    return next();
  }
  // also can't delete if more than one cell is selected
  event.preventDefault();
};

export function TablePlugin(): HtmlSerializablePlugin {
  return {
    deserialize: function(el, next) {
      const tag = el.tagName.toLowerCase();
      const format = kTagToFormatMap[tag];
      if (format) {
        const data = getDataFromElement(el);
        return {
          object: "block",
          type: format,
          ...data,
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
    postSerialize: function(html) {
      // slate-html-serializer uses react-dom/server/renderToStaticMarkup(), which
      // generates incorrect case for "colspan" (but not for "rowspan" ¯\_(ツ)_/¯).
      return html.replace("colSpan", "colspan");
    },

    renderBlock: (props: RenderBlockProps, editor: Editor, next: () => any) => {
      const { attributes, children, node } = props;
      const tag = kFormatToTagMap[node.type];
      return tag
              ? renderNodeAsTag(tag, node, { ...getRenderAttributesFromNode(node), ...attributes }, children)
              : next();
    },

    onBeforeInput: (event, editor, next) => {
      if (normalizeExpandedSelection(editor) === false) {
        event.preventDefault();
      }
      else {
        return next();
      }
    },

    onKeyDown: (event, editor, next) => {
      switch (event.key) {
        case 'Tab':
          return handleTab(event, editor, next);
        case 'Enter':
          return handleEnter(event, editor, next);
        case 'Backspace':
          return handleBackspace(event, editor, next);
        case 'Delete':
          return handleDelete(event, editor, next);
        default:
          return next();
      }
    }
  };
}
*/
