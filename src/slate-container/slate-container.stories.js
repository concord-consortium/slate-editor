import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { SlateContainer } from "./slate-container";

export default {
  title: "SlateContainer"
};

const combinedText = "This example demonstrates a combined toolbar/editor with minimal configuration.";

export const Combined = () => {
  const [value, setValue] = useState(combinedText);
  return (
    <SlateContainer value={value} onValueChange={_value => setValue(_value)} />
  );
};

const portalText = "This example demonstrates rendering the toolbar in a React portal (so" +
                  " it can be attached at an arbitrary point in the DOM outside the React" +
                  " hierarchy) as well as hiding/showing the toolbar on blur/focus.";
export const Portal = () => {
  const editorRef = useRef();
  const blurTimer = useRef();
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState(portalText);
  const [portalRoot, setPortalRoot] = useState();
  useLayoutEffect(() => {
    const storyRoot = document.getElementById('root');
    const _portalRoot = document.createElement('div');
    _portalRoot.className = 'react-toolbar-portal';
    storyRoot && storyRoot.appendChild(_portalRoot);
    setPortalRoot(_portalRoot);
    return (() => storyRoot && storyRoot.removeChild(_portalRoot));
  }, []);
  const onFocus = useCallback(() => {
    if (blurTimer.current) {
      clearTimeout(blurTimer.current);
      blurTimer.current = null;
    }
    setTimeout(() => setIsFocused(true));
  }, []);
  const onBlur = useCallback(() => {
    // When clicking on toolbar buttons, there is a momentary blur/focus that occurs.
    // We don't want the toolbar to flicker, so we set a timer and only blur if we
    // don't get a focus event shortly after.
    if (blurTimer.current) return;
    blurTimer.current = setTimeout(() => {
      setIsFocused(false);
      blurTimer.current = null;
    }, 100);
  }, []);
  useEffect(() => {
    const onDown = (e) => {
      if (!e.target.closest(".slate-container, .slate-toolbar")) {
        editorRef.current && editorRef.current.blur();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, []);
  return (
    <SlateContainer
      toolbar={{ portalRoot, show: isFocused, buttonsPerRow: 8 }}
      onEditorRef={editor => editorRef.current = editor}
      value={value}
      onValueChange={_value => setValue(_value)}
      onFocus={onFocus}
      onBlur={onBlur}
      />
  );
};
