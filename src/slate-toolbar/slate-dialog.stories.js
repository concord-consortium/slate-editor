import React, { useRef, useEffect, useState } from "react";
import { SlateContainer } from "../slate-container/slate-container";

export default {
  title: "ModalDialog"
};

const modalPortalText = "This example demonstrates rendering the modal dialog in a React portal (so" +
                  " it can be attached at an arbitrary point in the DOM outside the React hierarchy)." +
                  " The dialog is rendered in a portal-container div adjacent to the slate-container div.";

export const PortalModalDialog = () => {
  const ref = useRef();
  const [portalRef, setportalRef] = useState();
  useEffect(() => {
    setportalRef(ref.current);
  }, []);
  const [value, setValue] = useState(modalPortalText);
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
  const [value, setValue] = useState(coloredModalText);
  return (
    <SlateContainer value={value} onValueChange={_value => setValue(_value)}
                    toolbar={{ colors: { fill: "#ffffff", background: "#FF7FB6" }}} />
  );
};
