/*
import React, { useRef, useEffect, useState } from "react";
import { textToSlate } from "../common/slate-types";
import { SlateContainer } from "../slate-container/slate-container";

export default {
  title: "ModalDialog"
};

const modalPortalText = "This example demonstrates rendering the modal dialog in a React portal (so" +
                  " it can be attached at an arbitrary point in the DOM outside the React hierarchy)." +
                  " The dialog is rendered in a portal-container div adjacent to the slate-container div.";

export const PortalModalDialog = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [portalRef, setportalRef] = useState<HTMLDivElement>();
  useEffect(() => {
    setportalRef(ref.current || undefined);
  }, []);
  const [value, setValue] = useState(textToSlate(modalPortalText));
  return (
    <div>
      <div className="portal-container" ref={ref}></div>
      <SlateContainer value={value} onValueChange={_value => setValue(_value)}
                      toolbar={{ modalPortalRoot: portalRef }} />
    </div>
  );
};

const coloredModalText = "This example demonstrates a modal dialog with custom colors inherited from the toolbar settings." +
                         " The header and button background colors of the modal dialog are adjusted.";

export const ColoredModalDialog = () => {
  const [value, setValue] = useState(textToSlate(coloredModalText));
  return (
    <SlateContainer value={value} onValueChange={_value => setValue(_value)}
                    toolbar={{ colors: {
                                buttonColors: { fill: "#ffffff", background: "#FF7FB6" }
                            }}} />
  );
};

const multipleInstance1Text = "Instance 1: This example demonstrates multiple editor instances showing separate dialogs.";
const multipleInstance2Text = "Instance 2: This example demonstrates multiple editor instances showing separate dialogs.";

export const MultipleEditorInstances = () => {
  const [value1, setValue1] = useState(textToSlate(multipleInstance1Text));
  const [value2, setValue2] = useState(textToSlate(multipleInstance2Text));
  return (
    <>
      <SlateContainer value={value1} onValueChange={_value => setValue1(_value)}
                      toolbar={{ colors: {
                                  buttonColors: { fill: "#ffffff", background: "#000080" }
                              }}} />
      <SlateContainer value={value2} onValueChange={_value => setValue2(_value)}
                      toolbar={{ colors: {
                                  buttonColors: { fill: "#ffffff", background: "#008000" }
                              }}} />
    </>
  );
};
*/
