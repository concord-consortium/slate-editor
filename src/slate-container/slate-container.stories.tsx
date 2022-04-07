import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Editor } from "slate-react";
import { SlateContainer } from "./slate-container";
import { textToSlate } from "../common/slate-types";

export default {
  title: "SlateContainer"
};

const combinedText = "This example demonstrates a combined toolbar/editor with minimal configuration.";

export const Combined = () => {
  const [value, setValue] = useState(textToSlate(combinedText));
  return (
    <SlateContainer value={value} onValueChange={_value => setValue(_value)} />
  );
};

const coloredText = "This example demonstrates a toolbar with custom colors with the selection indicated by a change in the fill color.";

export const ColoredToolbarSelectedFill = () => {
  const [value, setValue] = useState(textToSlate(coloredText));
  return (
    <SlateContainer value={value} onValueChange={_value => setValue(_value)}
      toolbar={{ colors: {
                  buttonColors: { fill: "#ffffff", background: "#177991" },
                  selectedColors: { fill: "#72bfca", background: "#177991" }
              }}} />
  );
};

const backgroundText = "This example demonstrates a toolbar with custom colors with the selection indicated by a change in the fill and background colors.";

export const ColoredToolbarSelectedBackground = () => {
  const [value, setValue] = useState(textToSlate(backgroundText));
  return (
    <SlateContainer value={value} onValueChange={_value => setValue(_value)}
      toolbar={{ colors: {
                  buttonColors: { fill: "#ffffff", background: "#177991" },
                  selectedColors: { fill: "#177991", background: "#72bfca" }
              }}} />
  );
};

const themeColorText = "This example demonstrates a toolbar with black icons on a white background.";

export const BlackOnWhiteToolbar = () => {
  const [value, setValue] = useState(textToSlate(themeColorText));
  return (
    <SlateContainer value={value} onValueChange={_value => setValue(_value)}
      toolbar={{ colors: {
                  buttonColors: { fill: "#000000", background: "#ffffff" },
                  selectedColors: { fill: "#ffffff", background: "#000000" },
                  themeColor: "#177991"
              }}} />
  );
};

const themeColorText2 = "This example demonstrates a toolbar with white icons on a black background.";

export const WhiteOnBlackToolbar = () => {
  const [value, setValue] = useState(textToSlate(themeColorText2));
  return (
    <SlateContainer value={value} onValueChange={_value => setValue(_value)}
      toolbar={{ colors: {
                  buttonColors: { fill: "#ffffff", background: "#000000" },
                  selectedColors: { fill: "#000000", background: "#ffffff" },
                  themeColor: "#177991"
              }}} />
  );
};

const portalText = "This example demonstrates rendering the toolbar in a React portal (so" +
                  " it can be attached at an arbitrary point in the DOM outside the React" +
                  " hierarchy) as well as hiding/showing the toolbar on blur/focus.";
export const Portal = () => {
  const editorRef = useRef<Editor>();
  const blurTimer = useRef<number>();
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState(textToSlate(portalText));
  const [portalRoot, setPortalRoot] = useState<HTMLDivElement>();
  useLayoutEffect(() => {
    const storyRoot = document.getElementById('root');
    const _portalRoot = document.createElement('div');
    _portalRoot.className = 'react-toolbar-portal';
    storyRoot?.appendChild(_portalRoot);
    setPortalRoot(_portalRoot);
    return (() => { storyRoot?.removeChild(_portalRoot); });
  }, []);
  const onFocus = useCallback(() => {
    if (blurTimer.current) {
      clearTimeout(blurTimer.current);
      blurTimer.current = undefined;
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
      blurTimer.current = undefined;
    }, 100);
  }, []);
  useEffect(() => {
    const onDown = (e: MouseEvent | TouchEvent) => {
      const elt = e.target as HTMLElement | null;
      if (!elt?.closest(".slate-container, .slate-toolbar")) {
        editorRef.current && editorRef.current?.blur();
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
