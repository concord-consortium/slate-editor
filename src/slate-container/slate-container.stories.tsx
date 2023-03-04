import React, { useCallback, useLayoutEffect, useState } from "react";
import { SlateContainer } from "./slate-container";
import { textToSlate } from "../common/slate-types";

export default {
  title: "SlateContainer"
};

const combinedText = "This example demonstrates a combined toolbar/editor with minimal configuration.";

export const Combined = () => {
  const initialValue = textToSlate(combinedText);
  return (
    <SlateContainer value={initialValue} />
  );
};

const coloredText = "This example demonstrates a toolbar with custom colors with the selection indicated by a change in the fill color.";

export const ColoredToolbarSelectedFill = () => {
  const initialValue = textToSlate(coloredText);
  return (
    <SlateContainer value={initialValue}
      toolbar={{
        colors: {
          buttonColors: { fill: "#ffffff", background: "#177991" },
          selectedColors: { fill: "#72bfca", background: "#177991" }
        }
      }} />
  );
};

const backgroundText = "This example demonstrates a toolbar with custom colors with the selection indicated by a change in the fill and background colors.";

export const ColoredToolbarSelectedBackground = () => {
  const initialValue = textToSlate(backgroundText);
  return (
    <SlateContainer value={initialValue}
      toolbar={{
        colors: {
          buttonColors: { fill: "#ffffff", background: "#177991" },
          selectedColors: { fill: "#177991", background: "#72bfca" }
        }
      }} />
  );
};

const themeColorText = "This example demonstrates a toolbar with black icons on a white background.";

export const BlackOnWhiteToolbar = () => {
  const initialValue = textToSlate(themeColorText);
  return (
    <SlateContainer value={initialValue}
      toolbar={{
        colors: {
          buttonColors: { fill: "#000000", background: "#ffffff" },
          selectedColors: { fill: "#ffffff", background: "#000000" },
          themeColor: "#177991"
        }
      }} />
  );
};

const themeColorText2 = "This example demonstrates a toolbar with white icons on a black background.";

export const WhiteOnBlackToolbar = () => {
  const initialValue = textToSlate(themeColorText2);
  return (
    <SlateContainer value={initialValue}
      toolbar={{
        colors: {
          buttonColors: { fill: "#ffffff", background: "#000000" },
          selectedColors: { fill: "#000000", background: "#ffffff" },
          themeColor: "#177991"
        }
      }} />
  );
};

const portalText = "This example demonstrates rendering the toolbar in a React portal (so" +
                  " it can be attached at an arbitrary point in the DOM outside the React" +
                  " hierarchy) as well as hiding/showing the toolbar on blur/focus.";
export const Portal = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [portalRoot, setPortalRoot] = useState<HTMLDivElement>();
  useLayoutEffect(() => {
    const storyRoot = document.getElementById('root');
    const _portalRoot = document.createElement('div');
    _portalRoot.className = 'react-toolbar-portal';
    storyRoot?.appendChild(_portalRoot);
    setPortalRoot(_portalRoot);
    return (() => { storyRoot?.removeChild(_portalRoot); });
  }, []);
  const onFocus = useCallback(() => setIsFocused(true), []);
  const onBlur = useCallback(() => setIsFocused(false), []);
  return (
    <SlateContainer
      toolbar={{ portalRoot, show: isFocused, buttonsPerRow: 8 }}
      value={textToSlate(portalText)}
      onFocus={onFocus}
      onBlur={onBlur}
      />
  );
};
