import { BasePoint, Editor, Element as SlateElement, Node, Range, Transforms } from "slate";
import { CustomElement, CustomMarks, CustomText, EmptyText, MarkType } from "./custom-types";
import { EFormat } from "./slate-types";

export function isCustomText(node: CustomText | EmptyText): node is CustomText {
  return !!node.text ||
          !!(node as CustomText).bold || !!(node as CustomText).code || !!(node as CustomText).color ||
          !!(node as CustomText).deleted || !!(node as CustomText).italic || !!(node as CustomText).subscript ||
          !!(node as CustomText).superscript || !!(node as CustomText).underlined;
}

const LIST_TYPES = ['ordered-list', 'bulleted-list'];
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'];

export const defaultHotkeyMap = {
  'mod+b': (editor: Editor) => toggleMark(editor, EFormat.bold),
  'mod+i': (editor: Editor) => toggleMark(editor, EFormat.italic),
  'mod+u': (editor: Editor) => toggleMark(editor, EFormat.underlined),
  'mod+\\': (editor: Editor) => toggleMark(editor, EFormat.code)
};

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

export function unwrapElement(editor: Editor, format: string) {
  Transforms.unwrapNodes(editor, {
    match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format
  });
}

export function wrapElement(editor: Editor, format: string, addProps?: Record<string, any>, defaultText = "") {
  if (isBlockActive(editor, format)) {
    unwrapElement(editor, format);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const element: CustomElement = {
    type: format,
    ...addProps,
    children: isCollapsed && defaultText ? [{ text: defaultText }] : [],
  } as CustomElement;

  if (isCollapsed) {
    Transforms.insertNodes(editor, element);
  }
  else {
    Transforms.wrapNodes(editor, element, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
}

export function selectedElements(editor: Editor) {
  const { selection } = editor;
  return selection
          ? Array.from(Editor.nodes(editor, {
              at: Editor.unhangRange(editor, selection),
              match: n => !Editor.isEditor(n) && SlateElement.isElement(n)
            })) as unknown as CustomElement[]
          : [];
}

// Returns true if the given base point is in the editor, false otherwise.
// The base point might be outside the editor if there is no node at its path or its offset is greater than the number of characters in the node
function validateBasePoint(editor: Editor, basePoint: BasePoint) {
  const node = Node.get(editor, basePoint.path);
  // Check to make sure the path is legal and results in a text node
  if (!node || !("text" in node)) {
    return false;
  }
  return basePoint.offset < node.text.length;
}

// Makes the selection legal if it has become illegal (for example, if undoing changed the underlying model).
export function normalizeSelection(editor?: Editor) {
  if (editor?.selection) {
    const editorRange = Editor.range(editor, []);
    const selection = editor.selection;

    let legalSelection = Range.includes(editorRange, selection);
    // Even if the selection and editor ranges overlap, we need to make sure that the actual points are legal.
    // This can be a problem because offsets are not checked for any nodes except the last one.
    if (legalSelection) {
      legalSelection = validateBasePoint(editor, selection.anchor);
    }
    if (legalSelection) {
      legalSelection = validateBasePoint(editor, selection.focus);
    }

    if (!legalSelection) {
      const end = Editor.end(editor, []);
      Transforms.select(editor, { anchor: end, focus: end });
    }
  }
}
