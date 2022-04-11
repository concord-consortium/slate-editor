import React, { useEffect } from "react";

import "./modal-cover.scss";

interface IProps {
  className?: string;
  allowOutsideClick?: boolean;
}
export const ModalCover = ({ className = "", allowOutsideClick = false }: IProps) => {

  // block clicks outside modal unless instructed not to
  useEffect(() => {
    const handlePointerDown = (e: any) => {
      if (!allowOutsideClick && e.target.classList.contains("ccrte-modal-cover")) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    document.addEventListener("mousedown", handlePointerDown, true);
    document.addEventListener("touchstart", handlePointerDown, true);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown, true);
      document.removeEventListener("touchstart", handlePointerDown, true);
    };
  }, [allowOutsideClick]);

  return (
    <div className={`ccrte-modal-cover ${className}`}/>
  );
};
