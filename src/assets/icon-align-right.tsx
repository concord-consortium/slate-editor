import React from "react";
import { IconProps } from "./icon-props";

// FontAwesome icon: https://www.iconfinder.com/icons/1608497/align_right_icon
// initial JSX conversion: https://react-svgr.com/playground/
export default function IconAlignRight(props: IconProps) {
  return (
    <svg viewBox="0 0 1792 1792" {...props}>
      <path d="M1792 1344v128q0 26-19 45t-45 19H64q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1664q26 0 45 19t19 45zm0-384v128q0 26-19 45t-45 19H448q-26 0-45-19t-19-45V960q0-26 19-45t45-19h1280q26 0 45 19t19 45zm0-384v128q0 26-19 45t-45 19H192q-26 0-45-19t-19-45V576q0-26 19-45t45-19h1536q26 0 45 19t19 45zm0-384v128q0 26-19 45t-45 19H576q-26 0-45-19t-19-45V192q0-26 19-45t45-19h1152q26 0 45 19t19 45z" />
    </svg>
  );
}
