import React from "react";
import { IconProps } from "./icon-props";

// FontAwesome icon: https://www.iconfinder.com/icons/1608746/italic_icon
// initial JSX conversion: https://react-svgr.com/playground/
export default function IconItalic(props: IconProps) {
  return (
    <svg viewBox="0 0 1792 1792" {...props}>
      <path d="M384 1662l17-85q6-2 81.5-21.5T594 1518q28-35 41-101 1-7 62-289t114-543.5T863 288v-25q-24-13-54.5-18.5t-69.5-8-58-5.5l19-103q33 2 120 6.5t149.5 7T1090 144q48 0 98.5-2.5t121-7 98.5-6.5q-5 39-19 89-30 10-101.5 28.5T1179 279q-8 19-14 42.5t-9 40-7.5 45.5-6.5 42q-27 148-87.5 419.5T977 1224q-2 9-13 58t-20 90-16 83.5-6 57.5l1 18q17 4 185 31-3 44-16 99-11 0-32.5 1.5t-32.5 1.5q-29 0-87-10t-86-10q-138-2-206-2-51 0-143 9t-121 11z" />
    </svg>
  );
}
