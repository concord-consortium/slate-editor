import { isKeyHotkey } from "is-hotkey";
import map from "lodash/map";
import { useMemo } from "react";
import { Editor } from "slate";

export type HotkeyMap = Record<string, (editor: Editor) => void>;
export const useHotkeyMap = (hotkeyMap: HotkeyMap) => {
  return useMemo(() => {
    return map(hotkeyMap, (invoker: (editor: Editor) => void, hotkey: string) => (
                  { isHotkey: isKeyHotkey(hotkey), invoker }
              ));
  }, [hotkeyMap]);
};
