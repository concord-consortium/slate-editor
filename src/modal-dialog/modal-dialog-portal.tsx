import React from "react";
import ReactDOM from "react-dom";
import { IProps as IModalDialogProps, ModalDialog } from "./modal-dialog";

export interface IProps extends IModalDialogProps {
  modalPortalRoot?: HTMLDivElement;
}

export const ModalDialogPortal: React.FC<IProps> = (props: IProps) => {
  const { modalPortalRoot, ...others } = props;
  const modalDialog = <ModalDialog {...others} />;
  return (
    modalPortalRoot
      ? ReactDOM.createPortal(modalDialog, modalPortalRoot)
      : modalDialog
  );
};
