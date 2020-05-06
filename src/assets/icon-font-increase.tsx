import React from "react";
import { IconProps } from "./icon-props";

// FontAwesome icon: https://www.iconfinder.com/icons/1608420/minus_search_icon
// initial JSX conversion: https://react-svgr.com/playground/
export default function IconFontIncrease(props: IconProps) {
  return (
    <svg height={1792} viewBox="0 0 1792 1792" width={1792} {...props}>
      <path d="M1088 800v64q0 13-9.5 22.5T1056 896H832v224q0 13-9.5 22.5T800 1152h-64q-13 0-22.5-9.5T704 1120V896H480q-13 0-22.5-9.5T448 864v-64q0-13 9.5-22.5T480 768h224V544q0-13 9.5-22.5T736 512h64q13 0 22.5 9.5T832 544v224h224q13 0 22.5 9.5t9.5 22.5zm128 32q0-185-131.5-316.5T768 384 451.5 515.5 320 832t131.5 316.5T768 1280t316.5-131.5T1216 832zm512 832q0 53-37.5 90.5T1600 1792q-54 0-90-38l-343-342q-179 124-399 124-143 0-273.5-55.5t-225-150-150-225T64 832t55.5-273.5 150-225 225-150T768 128t273.5 55.5 225 150 150 225T1472 832q0 220-124 399l343 343q37 37 37 90z" />
    </svg>
  );
}
