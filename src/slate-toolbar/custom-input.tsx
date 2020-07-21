import React, { useEffect, useRef } from "react";

export interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputRef?: React.RefObject<HTMLInputElement>;
  onDOMChange?: (e: any) => void;
}

/*
 * Wrapper for <input> which adds onDOMChange callback which triggers on browser's "change"
 * events. (React's "onChange" triggers on browser's "input" events.) This distinction
 * matters for text <input>s, where "input" is triggered on every keystroke but "change"
 * is only triggered when user "completes" editing of the field, e.g. on blur after having
 * made changes. There also appear to be (or have been) some cases in which "change" events
 * are/were sent without corresponding "input" events, e.g. browser auto-fill.
 */
export const CustomInput: React.FC<IProps> = (props) => {
  const { inputRef, onDOMChange, ...others } = props;
  // cf. https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31065#issuecomment-446425911
  const _inputRef = useRef<HTMLInputElement | null>(null);

  function handleInputRef(elt: HTMLInputElement | null) {
    _inputRef.current = elt;
    // cf. https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31065#issuecomment-596081842
    inputRef && ((inputRef as React.MutableRefObject<HTMLInputElement | null>).current = elt);
  }

  useEffect(() => {
    const elt = _inputRef.current;
    if (elt && onDOMChange) {
      elt.addEventListener("change", onDOMChange);
    }
    return () => {
      if (elt && onDOMChange) {
        elt.removeEventListener("change", onDOMChange);
      }
    };
  }, [onDOMChange]);

  return <input ref={handleInputRef} {...others} />;
};
