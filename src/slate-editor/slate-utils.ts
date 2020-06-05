import { Block, MarkProperties, Inline, Node, Text, Value } from "slate";
import { Editor, RenderMarkProps } from "slate-react";
import { EFormat } from "../common/slate-types";

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

export function hasBlock(value: Value, format: EFormat) {
  return value.blocks.some(node => isBlockOfType(node, format));
}

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
