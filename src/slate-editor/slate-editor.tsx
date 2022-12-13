import React, { useCallback } from 'react';
import isHotkey from 'is-hotkey';
import { Editable, useSlate} from 'slate-react';
import {
  Descendant,
} from 'slate';
import { Leaf } from './leaf';
import { Element } from './element';
import {toggleMark} from './slate-utils';

import './slate-editor.scss';

export interface EditorSelectionJson {
  anchor: number;
  focus: number;
}

export interface IProps {
  className?: string;
  value?: Descendant[] | string;
  children?: Descendant;
  onChange?: (value: Descendant[] | string) => void;
  placeholder?: string;
  readOnly?: boolean;
  // hotkeyMap?: HotkeyMap; // FIXME: Sort out hotkey map
  history?: boolean; // FIXME: implmement IEditorHistoryOptions;
  onFocus?: (editor?: any) => void; // FIXME: any type
  onBlur?: (editor?: any) => void; // FIXME: any type
  style?: React.CSSProperties;
}

const HOTKEYS: Record<string, string> = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
};


const SlateEditor: React.FC<IProps> = (props: IProps) => {
  const {className, onFocus, onBlur, placeholder, readOnly, } = props;
  // FIXME: Add back font size
  // const value = typeof props.value === "string" ?
  //                 textToSlate(props.value)
  //                  : props.value || textToSlate("");
  // const fontSize = getFontSize(value);
  // const fontStyle = fontSize ? {fontSize: `${fontSize}em`} : undefined;
  const style = { ...props.style };

  const classes = `ccrte-editor slate-editor ${className || ""}`;
  const renderElement = useCallback((propsb: any) => <Element {...propsb} />, []);
  const renderLeaf = useCallback((propsb:any) => <Leaf {...propsb} />, []);
  
  const editor = useSlate();
  return (
      <Editable
        data-testid="ccrte-editor"
        className={classes}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder={placeholder}
        spellCheck
        autoFocus
        readOnly={readOnly}
        onBlur={onBlur}
        onFocus={onFocus}
        style={style}
        onKeyDown={(event:any) => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event as any)) {
              event.preventDefault();
              const mark = HOTKEYS[hotkey];
              toggleMark(editor, mark);
            }
          }
        }}
      />
  );
};

SlateEditor.displayName = "SlateEditor";
export { SlateEditor };