import React, { useState } from "react";
import { SlateContainer } from "./slate-container";

export default {
  title: "SlateContainer"
};

export const Combined = () => {
  const [value, setValue] = useState("");
  return (
    <SlateContainer value={value} onValueChange={_value => setValue(_value)} />
  );
};
