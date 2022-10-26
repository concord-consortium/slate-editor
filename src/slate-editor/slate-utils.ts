import { Editor, Element as SlateElement, Range, Transforms } from "slate";
import { CustomElement, CustomMarks, CustomText, EmptyText, MarkType, EFormat } from "../common/slate-types";

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

export function hasActiveInline(value: Value, format: EFormat | string) {
  return value.inlines.some(inline => inline?.type === format);
}

export const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    } as any;
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] } as any;
    Transforms.wrapNodes(editor, block);
  }
};

export const isBlockActive = (editor: Editor, format: string, blockType = 'type') => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        (n as any)[blockType] === format,
    })
  );

  return !!match;
};

export const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor) as CustomMarks;
  return !!marks?.[format as MarkType];
};

export const toggleMark = (editor: Editor, format: string, value: any = true) => {
  if (isMarkActive(editor, format)) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, value);
  }
};

export function toggleSuperSubscript(editor: Editor, format: EFormat.subscript | EFormat.superscript) {
  if (isMarkActive(editor, format)) {
    Editor.removeMark(editor, format);
  } else {
    // super/subscripts are essentially a tristate mark, since both can't be true simultaneously
    Editor.removeMark(editor, EFormat.subscript);
    Editor.removeMark(editor, EFormat.superscript);
    toggleMark(editor, format);
  }
}
