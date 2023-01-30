import isHotkey from 'is-hotkey';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Descendant } from 'slate';
import { Editable, RenderLeafProps, useSlate } from 'slate-react';

import { Element } from './element';
import { Leaf } from './leaf';
import { HotkeyMap } from '../common/slate-types';

import './slate-editor.scss';

const defaultHistoryKeys: HotkeyMap = {
  "mod+z": editor => editor.undo(),
  "mod+shift+z": editor => editor.redo()
};

export interface IProps {
  className?: string;
  placeholder?: string;
  readOnly?: boolean;
  hotkeyMap?: HotkeyMap;
  historyKeys?: HotkeyMap;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
  onChange?: (children: Descendant[]) => void;
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
}
export const SlateEditor = ({
  className, placeholder, readOnly, hotkeyMap, historyKeys, onBlur, onChange, onFocus
}: IProps) => {
  const editor = useSlate();

  useEffect(() => {
    const { onChange: origOnChange } = editor;
    editor.onChange = () => {
      origOnChange?.();
      onChange?.(editor.children);
    };
  }, [editor, onChange]);

  const hasHistory = "undo" in editor;
  const _historyKeys = hasHistory ? historyKeys || defaultHistoryKeys : undefined;
  const hotKeys = useMemo(() => _historyKeys
                                  ? { ..._historyKeys, ...hotkeyMap }
                                  : hotkeyMap, [_historyKeys, hotkeyMap]);
  // TODO: do we need useCallback here?
  // Slate examples use it but we may be able to pass Element, Leaf directly
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, []);

  return (
    <Editable
      className={`ccrte-editor slate-editor ${className || ""}`}
      data-testid="ccrte-editor"
      readOnly={readOnly}
      renderElement={renderElement}
      renderLeaf={renderLeaf}
      placeholder={placeholder}
      spellCheck
      onBlur={onBlur}
      onFocus={onFocus}
      onKeyDown={event => {
        for (const hotkey in hotKeys) {
          if (isHotkey(hotkey, event)) {
            event.preventDefault();
            const fn = hotKeys[hotkey];
            fn?.(editor);
          }
        }
      }}
    />
  );
};
