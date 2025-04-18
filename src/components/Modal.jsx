import React, { useEffect, useRef } from 'react';

export default function Modal({ isOpen, onClose, content }) {
  const dialogRef = useRef();
  console.log(content)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog ref={dialogRef} className="modal-dialog">
        <div className="dialog-container">
            <img src={content?.image} />
            <div className="dialog-container-wrap">
                <div>
                    <span>{content?.text || "modal text"}</span>
                    <h3>{content?.title || "This is modal"}</h3>
                </div>
                <div>
                    <form method="dialog">
                        <button onClick={onClose}>닫기</button>
                    </form>
                </div>
            </div>
        </div>
    </dialog>
  );
}