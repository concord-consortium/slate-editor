import React from "react";
import ReactDOM from "react-dom";
import { IProps as IToolbarProps, SlateToolbar } from "./slate-toolbar";

export interface IProps extends IToolbarProps {
  portalRoot?: HTMLDivElement;
}

export const SlateToolbarPortal: React.FC<IProps> = (props: IProps) => {
  const { portalRoot, ...others } = props;
  const toolbar = <SlateToolbar {...others} />;
  return (
    portalRoot
      ? ReactDOM.createPortal(toolbar, portalRoot)
      : toolbar
  );
};
