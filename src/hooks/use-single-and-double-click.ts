import { useRef } from "react";

const kMaxDoubleClickInterval = 600;

export function useSingleAndDoubleClick(onClick?: () => void, onDoubleClick?: () => void) {
  const timer = useRef<number | null>(null);

  function handleClick() {
    if (!onClick) return;
    if (!onDoubleClick) {
      onClick();
    }
    else {
      // if there's a double-click handler, we don't trigger the single-click handler
      // until we know whether it's a double-click or not
      timer.current = window.setTimeout(() => {
        if (timer.current) {
          onClick();
        }
        timer.current = null;
      }, kMaxDoubleClickInterval);
    }
  }

  function handleDoubleClick() {
    if (onDoubleClick) {
      if (timer.current) {
        window.clearTimeout(timer.current);
        timer.current = null;
      }
      onDoubleClick();
    }
  }

  return { handleClick, handleDoubleClick };
}
