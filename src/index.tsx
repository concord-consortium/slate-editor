export { Editable, withReact, useSlate, Slate, RenderElementProps, ReactEditor, useFocused, useSelected, useSlateStatic } from "slate-react";
export {Range, Editor, Node, Transforms} from "slate"; 
export {withHistory} from "slate-history";
export {createEditor} from "./common/create-editor";

// Notes: RenderAttributes and RenderInlineProps are used in Clue in the variable plugin
// export { EditorContent, EditorRange, EditorValue, EFormat, slateToText, textToSlate,
//   kSlateVoidClass } from "./common/slate-types";
export {CustomEditor, CustomElement, EditorValue, BaseElement, EFormat, textToSlate, slateToText} from "./common/slate-types";
export {registerElement} from "./slate-editor/element";
// export { DialogContent } from "./modal-dialog/dialog-content";
// export { DialogFooter } from "./modal-dialog/dialog-footer";
// export { DialogHeader } from "./modal-dialog/dialog-header";
export {
  DisplayDialogSettings, FieldType, IDialogController, IField, IFieldValues, IRow, SelectOptions, SelectValue
} from "./modal-dialog/dialog-types";
// export { ModalCover } from "./modal-dialog/modal-cover";
export { ModalDialog, IProps as IModalDialogProps } from "./modal-dialog/modal-dialog";
// export { HtmlSerializablePlugin } from "./plugins/html-serializable-plugin";
export { htmlToSlate, slateToHtml } from "./serialization/html-serializer";
// export { getDataFromElement, getRenderAttributesFromNode, classArray } from "./serialization/html-utils";
export {deserializeValueFromLegacy } from "./serialization/legacy-serialization";
export {serializeValue, serializeDocument} from "./serialization/serialization";
export {convertDocument, slate47to50} from "./serialization/slate-json-conversion";
// export {
//   deserializeValueFromLegacy, serializeValueToLegacy, validateNodeData
// } from "./serialization/legacy-serialization";
// export {
//   deserializeDocument, deserializeValue, serializeDocument, serializeValue, SlateDocument, SlateExchangeValue
// } from "./serialization/serialization";
export { SlateContainer } from "./slate-container/slate-container";
export { SlateEditor } from "./slate-editor/slate-editor";
// export { getContentHeight, handleToggleSuperSubscript, hasActiveInline } from "./slate-editor/slate-utils";
export {wrapElement, unwrapElement, isMarkActive, isBlockActive, toggleMark, toggleSuperSubscript, toggleBlock} from "./slate-editor/slate-utils";
export { SlateToolbar, ToolbarTransform } from "./slate-toolbar/slate-toolbar";
export { useSerializing } from "./hooks/use-serializing";
//export { EditorToolbar, IButtonSpec, IToolbarColors, getPlatformTooltip } from "./editor-toolbar/editor-toolbar";
// export {
//   OnChangeColorFn, OnChangeFn, OnClickFn, OnDidInvokeToolFn, OnMouseFn, ToolbarButton
// } from "./editor-toolbar/toolbar-button";

import "./modal-dialog/dialog-content.scss";

import "./modal-dialog/dialog-footer.scss";
import "./modal-dialog/dialog-header.scss";
import "./modal-dialog/form-checkbox-field.scss";
import "./modal-dialog/form-field-entry.scss";
import "./modal-dialog/modal-cover.scss";
import "./modal-dialog/modal-dialog.scss";
import "./slate-container/slate-container.scss";
import "./slate-editor/slate-editor.scss";
import "./editor-toolbar/editor-toolbar.scss";
