import React from "react";
import { IconProps } from "./icon-props";

// FontAwesome icon: https://www.iconfinder.com/icons/1608494/align_center_icon
// initial JSX conversion: https://react-svgr.com/playground/
export default function IconAlignCenter(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" {...props}>
        <text textAnchor="middle" x="50%" y="12">v=</text>
    </svg>
  );
}
