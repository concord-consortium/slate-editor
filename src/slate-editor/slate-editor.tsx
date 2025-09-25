import isHotkey from 'is-hotkey';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Descendant } from 'slate';
import { Editable, RenderElementProps, RenderLeafProps, useSlate } from 'slate-react';

import { Element } from './element';
import { Leaf } from './leaf';
import { HotkeyMap } from '../common/slate-types';
import { defaultHotkeyMap } from '../common/slate-utils';

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
  // Note: in legacy slate-editor versions the onBlur/onFocus events were model-based rather than
  // DOM-based because the two didn't always correspond and the model-level events were more useful.
  // We'll have to see whether these newer DOM-based callbacks work as expected.
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
  onChange?: (children: Descendant[]) => void;
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
}
export const SlateEditor = ({
  className, placeholder, readOnly, hotkeyMap, historyKeys, onBlur, onChange, onFocus
}: IProps) => {
  const editor = useSlate();
  const origOnChangeRef = useRef<() => void>();

  useEffect(() => {
    origOnChangeRef.current = editor.onChange;
  }, [editor]);

  useEffect(() => {
    editor.onChange = () => {
      origOnChangeRef.current?.();
      onChange?.(editor.children);
    };
  }, [editor, onChange]);

  const hasHistory = "undo" in editor;
  const _historyKeys = hasHistory ? historyKeys || defaultHistoryKeys : undefined;
  const _hotkeyMap = hotkeyMap || defaultHotkeyMap;
  const hotKeys = useMemo(() => _historyKeys
                                  ? { ..._historyKeys, ..._hotkeyMap }
                                  : _hotkeyMap, [_historyKeys, _hotkeyMap]);
  // TODO: do we need useCallback here?
  // Slate examples use it but we may be able to pass Element, Leaf directly
  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, []);

  return (
    <Editable
      className={`ccrte-editor slate-editor ${className || ""}`}
      data-testid="ccrte-editor"
      readOnly={readOnly}
      style={editor.globalStyle({})}
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
