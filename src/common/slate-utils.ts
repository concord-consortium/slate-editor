import { Editor, Element as SlateElement, Transforms } from "slate";
import { CustomMarks, CustomText, EmptyText, MarkType } from "./custom-types";
import { EFormat } from "./slate-types";

export function isCustomText(node: CustomText | EmptyText): node is CustomText {
  return !!node.text ||
          !!(node as CustomText).bold || !!(node as CustomText).code || !!(node as CustomText).color ||
          !!(node as CustomText).deleted || !!(node as CustomText).italic || !!(node as CustomText).subscript ||
          !!(node as CustomText).superscript || !!(node as CustomText).underlined;
}

const LIST_TYPES = ['numbered-list', 'bulleted-list'];
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'];

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
