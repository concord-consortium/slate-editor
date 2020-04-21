import { MarkProperties, Range, Value } from "slate";
import { Editor } from "slate-react";
import { EFormat } from "../common/slate-types";

export function findActiveMark(value: Value, format: EFormat) {
  return value.activeMarks.find(function(mark) { return mark?.type === format; });
}

export function hasActiveMark(value: Value, format: EFormat) {
  return !!findActiveMark(value, format);
}

export function hasBlock(value: Value, format: EFormat) {
  return value.blocks.some(function(node) { return node?.type === format; });
}

export function selectionContainsBlock(value: Value, format: EFormat) {
  const { document, selection: { anchor, focus } } = value;
  const currentRange = Range.create({ anchor, focus });
  const nodes = document.getDescendantsAtRange(currentRange);
  return nodes.some((node: any) => node.type === format);
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

export function handleToggleBlock(format: EFormat, editor: any) {
  const DEFAULT_BLOCK_TYPE = "";
  const { value: { blocks } } = editor;
  const containsListItems = hasBlock(editor.value, EFormat.listItem);
  const hasToggledBlock = blocks.some((block: any) => block.type === format);
  editor.setBlocks(hasToggledBlock ? DEFAULT_BLOCK_TYPE : format);
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

export function handleToggleListBlock(format: EFormat, editor: any) {
  const DEFAULT_BLOCK_TYPE = "";
  const { value: { blocks, document } } = editor;
  const containsListItems = blocks.some((block: any) => block.type === EFormat.listItem);
  const isListOfThisType = blocks.some((block: any) => {
    return !!document.getClosest(block.key, (parent: any) => parent.type === format);
  });
  if (! containsListItems) {
    // For a brand new list, first set the selection to be a list-item.
    // Then wrap the new list-items with the appropriate type of block.
    editor.setBlocks(EFormat.listItem)
          .wrapBlock(format);
  } else if (isListOfThisType) {
    // If we are setting a list to its current type, we treat this as
    // a toggle-off. To do this, we unwrap the selection and remove all
    // list-items.
    editor.setBlocks(DEFAULT_BLOCK_TYPE)  // Removes blocks typed w/ "list-item"
          .unwrapBlock(EFormat.bulletedList)
          .unwrapBlock(EFormat.numberedList);
  } else {
    // If we have ended up here, then we are switching a list between slate
    // types, i.e., bulleted <-> numbered.
    editor.unwrapBlock(format === EFormat.bulletedList ? EFormat.numberedList : EFormat.bulletedList)
          .wrapBlock(format);
  }
}
