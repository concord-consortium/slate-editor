import { useMemo } from "react";
import map from 'lodash/map';
import { isKeyHotkey } from "is-hotkey";
import { Editor } from "slate-react";

export type HotkeyMap = Record<string, (editor: Editor) => void>;
export const useHotkeyMap = (hotkeyMap: HotkeyMap) => {
  return useMemo(() => {
    return map(hotkeyMap, (invoker: (editor: Editor) => void, hotkey: string) => (
                  { isHotkey: isKeyHotkey(hotkey), invoker }
              ));
  }, [hotkeyMap]);
};
