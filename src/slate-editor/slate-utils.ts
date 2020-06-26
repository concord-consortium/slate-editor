import { Block, MarkProperties, Inline, Node, Text, Value } from "slate";
import { Editor, RenderMarkProps } from "slate-react";
import { EFormat } from "../common/slate-types";

export function getBoundingRectForBlock(editor: Editor, block?: Node) {
  const { document } = editor.value;
  const path = block && document.getPath(block.key) || undefined;
  // eslint-disable-next-line react/no-find-dom-node
  const elt: HTMLElement = path && editor.findDOMNode(path) as any;
  return elt?.getBoundingClientRect();
}

export function getContentHeight(editor: Editor) {
  const { document } = editor.value;
  const firstBounds = getBoundingRectForBlock(editor, document.nodes.first());
  const lastBounds = getBoundingRectForBlock(editor, document.nodes.last());
  return firstBounds && lastBounds
          ? lastBounds.bottom - firstBounds.top
          : undefined;
}

export function getRenderIndexOfMark(props: RenderMarkProps) {
  const { mark, marks } = props;
  let markIndex = -1;
  let i = 0;
  marks.forEach(m => {
    if (m === mark) markIndex = i;
    ++i;
  });
  return markIndex;
}

export function findActiveMark(value: Value, format: EFormat) {
  return value.activeMarks.find(function(mark) { return mark?.type === format; });
}

export function hasActiveMark(value: Value, format: EFormat) {
  return !!findActiveMark(value, format);
}

export function isBlockOfType(node: Node | undefined, format: EFormat) {
  return Block.isBlock(node) && (node.type === format);
}

export function isInlineOfType(node: Node | undefined, format: EFormat) {
  return Inline.isInline(node) && (node.type === format);
}

// returns whether there is a selected block of the specified type.
// value.blocks represents the closest selected block(s), i.e. it may
// indicate that a list item is selected without indicating its list.
export function hasBlock(value: Value, format: EFormat) {
  return value.blocks.some(node => isBlockOfType(node, format));
}

// returns whether the selection touches any block of the specified type.
// this is a more expansive notion of selection than value.blocks, which
// includes any top-level blocks touched as well, e.g. if the caret is in
// a list item the top-level block will be returned as well.
export function selectionContainsBlock(value: Value, format: EFormat) {
  const { document, selection } = value;
  const nodes = document.getDescendantsAtRange(selection);
  return nodes.some(node => !Text.isText(node) && (node?.type === format));
}

export function hasActiveInline(value: Value, format: EFormat) {
  return value.inlines.some(inline => inline?.type === format);
}

export function handleToggleMark(format: EFormat | MarkProperties, editor: Editor) {
  editor.toggleMark(format);
}

export function handleToggleSuperSubscript(format: EFormat, editor: Editor) {
  const value = editor.value;
  if (hasActiveMark(value, EFormat.superscript) || hasActiveMark(value, EFormat.subscript)) {
    editor.removeMark(EFormat.superscript).removeMark(EFormat.subscript);
  } else {
    editor.toggleMark(format);
  }
}
