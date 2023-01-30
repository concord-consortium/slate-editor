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
  onChange?: (children: Descendant[]) => void;
}
export const SlateEditor = ({
  className, placeholder, readOnly, hotkeyMap, historyKeys, onChange
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
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, []);

  // const isFocused = useFocused();
  // useEffect(() => {
  //   console.log("SlateEditor focusChanged:", isFocused);
  // }, [isFocused]);

  return (
    <Editable
      className={`ccrte-editor slate-editor ${className || ""}`}
      data-testid="ccrte-editor"
      readOnly={readOnly}
      renderElement={renderElement}
      renderLeaf={renderLeaf}
      placeholder={placeholder}
      spellCheck
      autoFocus
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
