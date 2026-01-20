import React from "react";

interface ConfirmModalProps {
  show: boolean;
  title?: string;
  message?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  show,
  title = "Confirm",
  message,
  confirmLabel = "Yes, delete",
  cancelLabel = "Cancel",
  danger = true,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!show) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
      <div className="d-flex align-items-center justify-content-center h-100">
        <div className={"card " + (danger ? "border-danger" : "") } style={{ width: 480 }}>
          <div className="card-body">
            <h5 className={"card-title " + (danger ? "text-danger" : "")}>{title}</h5>
            <div className="mb-3">{message}</div>
            <div className="d-flex gap-2">
              <button className={"btn " + (danger ? "btn-danger" : "btn-primary")} onClick={onConfirm}>{confirmLabel}</button>
              <button className="btn btn-secondary" onClick={onCancel}>{cancelLabel}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
