import React from "react";
import { IconProps } from "./icon-props";

// FontAwesome icon: https://www.iconfinder.com/icons/212993/f03e_icon
// initial JSX conversion: https://react-svgr.com/playground/
export default function IconImage(props: IconProps) {
  return (
    <svg viewBox="0 0 1920 2048" {...props}>
      <path d="M640 704c0 53.333-18.667 98.667-56 136s-82.667 56-136 56-98.667-18.667-136-56-56-82.667-56-136 18.667-98.667 56-136 82.667-56 136-56 98.667 18.667 136 56 56 82.667 56 136zm1024 384v448H256v-192l320-320 160 160 512-512 416 416zm96-704H160c-8.667 0-16.167 3.167-22.5 9.5S128 407.333 128 416v1216c0 8.667 3.167 16.167 9.5 22.5s13.833 9.5 22.5 9.5h1600c8.667 0 16.167-3.167 22.5-9.5s9.5-13.833 9.5-22.5V416c0-8.667-3.167-16.167-9.5-22.5s-13.833-9.5-22.5-9.5zm160 32v1216c0 44-15.667 81.667-47 113s-69 47-113 47H160c-44 0-81.667-15.667-113-47s-47-69-47-113V416c0-44 15.667-81.667 47-113s69-47 113-47h1600c44 0 81.667 15.667 113 47s47 69 47 113z" />
    </svg>
  );
}
