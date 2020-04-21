import React from "react";
import { IconProps } from "./icon-props";

// FontAwesome icon: https://www.iconfinder.com/icons/213175/f10d_icon
// initial JSX conversion: https://react-svgr.com/playground/
export default function IconQuote(props: IconProps) {
  return (
    <svg viewBox="0 0 1664 2048" {...props}>
      <path d="M768 1088v384c0 53.333-18.667 98.667-56 136s-82.667 56-136 56H192c-53.333 0-98.667-18.667-136-56s-56-82.667-56-136V768c0-69.333 13.5-135.5 40.5-198.5S104 452 150 406s100.5-82.5 163.5-109.5S442.667 256 512 256h64c17.333 0 32.333 6.333 45 19s19 27.667 19 45v128c0 17.333-6.333 32.333-19 45s-27.667 19-45 19h-64c-70.667 0-131 25-181 75s-75 110.333-75 181v32c0 26.667 9.333 49.333 28 68s41.333 28 68 28h224c53.333 0 98.667 18.667 136 56s56 82.667 56 136zm896 0v384c0 53.333-18.667 98.667-56 136s-82.667 56-136 56h-384c-53.333 0-98.667-18.667-136-56s-56-82.667-56-136V768c0-69.333 13.5-135.5 40.5-198.5S1000 452 1046 406s100.5-82.5 163.5-109.5S1338.667 256 1408 256h64c17.333 0 32.333 6.333 45 19s19 27.667 19 45v128c0 17.333-6.333 32.333-19 45s-27.667 19-45 19h-64c-70.667 0-131 25-181 75s-75 110.333-75 181v32c0 26.667 9.333 49.333 28 68s41.333 28 68 28h224c53.333 0 98.667 18.667 136 56s56 82.667 56 136z" />
    </svg>
  );
}
