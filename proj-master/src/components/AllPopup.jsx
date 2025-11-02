import React from 'react';
import { createPortal } from 'react-dom';

export default function AllPopup({
  show,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = 'OK',
  cancelText,
  confirmVariant = 'primary',
}) {
  if (!show) return null;
  return createPortal(
    <>
      <div className="modal-backdrop fade show" style={{ display: 'block' }}></div>
      <div
        className="modal fade show"
        role="dialog"
        aria-modal="true"
        style={{ display: 'block' }}
        onClick={onClose}
      >
        <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            {title && (
              <div className="modal-header">
                <h5 className="modal-title">{title}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
              </div>
            )}
            <div className="modal-body">
              {typeof message === 'string' ? (
                <p className="mb-0" style={{ whiteSpace: 'pre-line' }}>{message}</p>
              ) : (
                message
              )}
            </div>
            <div className="modal-footer">
              {cancelText && (
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  {cancelText}
                </button>
              )}
              <button type="button" className={`btn ${confirmVariant === 'danger' ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm || onClose}>
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
