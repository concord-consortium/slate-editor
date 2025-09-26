import React from "react";
import { IconProps } from "../assets/icon-props";

export interface IProps extends IconProps {
  onChange?: (color: string) => void;
}

export default function InputColor(props: IProps) {
  const { width, height, fill } = props;
  const color = fill || "#000000";
  const style: React.CSSProperties = { width, height };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newColor = e.target.value;
    props.onChange?.(newColor);
  }

  return (
    <input type="color" style={style}
      value={color}
      onChange={handleChange}
      />
  );
}
