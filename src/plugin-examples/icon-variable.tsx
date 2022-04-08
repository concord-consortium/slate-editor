import React from "react";
import { IconProps } from "../assets/icon-props";

export default function IconVariable(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" {...props}>
        <text textAnchor="middle" x="50%" y="12">v=</text>
    </svg>
  );
}
