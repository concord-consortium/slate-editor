import React from "react";
import { IconProps } from "./icon-props";

// FontAwesome icon: https://www.iconfinder.com/icons/1608767/list_ul_icon
// initial JSX conversion: https://react-svgr.com/playground/
export default function IconBulletedList(props: IconProps) {
  return (
    <svg viewBox="0 0 1792 1792" {...props}>
      <path d="M384 1408q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm0-512q0 80-56 136t-136 56-136-56T0 896t56-136 136-56 136 56 56 136zm1408 416v192q0 13-9.5 22.5t-22.5 9.5H544q-13 0-22.5-9.5T512 1504v-192q0-13 9.5-22.5t22.5-9.5h1216q13 0 22.5 9.5t9.5 22.5zM384 384q0 80-56 136t-136 56-136-56T0 384t56-136 136-56 136 56 56 136zm1408 416v192q0 13-9.5 22.5t-22.5 9.5H544q-13 0-22.5-9.5T512 992V800q0-13 9.5-22.5T544 768h1216q13 0 22.5 9.5t9.5 22.5zm0-512v192q0 13-9.5 22.5T1760 512H544q-13 0-22.5-9.5T512 480V288q0-13 9.5-22.5T544 256h1216q13 0 22.5 9.5t9.5 22.5z" />
    </svg>
  );
}
