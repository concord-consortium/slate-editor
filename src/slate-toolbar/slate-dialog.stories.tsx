
import React, { useEffect, useMemo, useRef, useState } from "react";
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
  const initialValue = useMemo(() => textToSlate(modalPortalText), []);
  return (
    <div>
      <div className="portal-container" ref={ref}></div>
      <SlateContainer value={initialValue}
                      toolbar={{ modalPortalRoot: portalRef }} />
    </div>
  );
};

const coloredModalText = "This example demonstrates a modal dialog with custom colors inherited from the toolbar settings." +
                         " The header and button background colors of the modal dialog are adjusted.";

export const ColoredModalDialog = () => {
  const initialValue = useMemo(() => textToSlate(coloredModalText), []);
  return (
    <SlateContainer value={initialValue}
                    toolbar={{ colors: {
                                buttonColors: { fill: "#ffffff", background: "#FF7FB6" }
                            }}} />
  );
};

const multipleInstance1Text = "Instance 1: This example demonstrates multiple editor instances showing separate dialogs.";
const multipleInstance2Text = "Instance 2: This example demonstrates multiple editor instances showing separate dialogs.";

export const MultipleEditorInstances = () => {
  const initialValue1 = useMemo(() => textToSlate(multipleInstance1Text), []);
  const initialValue2 = useMemo(() => textToSlate(multipleInstance2Text), []);
  return (
    <>
      <SlateContainer value={initialValue1}
                      toolbar={{ colors: {
                                  buttonColors: { fill: "#ffffff", background: "#000080" }
                              }}} />
      <SlateContainer value={initialValue2}
                      toolbar={{ colors: {
                                  buttonColors: { fill: "#ffffff", background: "#008000" }
                              }}} />
    </>
  );
};
