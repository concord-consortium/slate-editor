import React, { useState } from "react";
import { IconProps } from "./icon-props";

export interface IProps extends IconProps {
  onChange?: (color: string) => void;
}

export default function InputColor(props: IProps) {
  const { width, height, fill } = props;
  const [ color, setColor] = useState(fill || "#000000");
  const style: React.CSSProperties = { width, height, padding: 0 };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newColor = e.target.value;
    setColor(newColor);
    props.onChange?.(newColor);
  }

  return (
    <input type="color" style={style}
      value={color}
      onInput={e => setColor((e.target as HTMLInputElement).value)}
      onChange={handleChange}
      />
  );
}
