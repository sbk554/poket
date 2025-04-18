import React, { useEffect, useRef } from 'react';
import '../css/Modal.css';

export default function Modal({ isOpen, onClose, content, typeColor }) {
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
                <div className="wrap-title">
                    <h3>
                        <span>{content?.text || "modal text"}</span>
                        {content?.title || "This is modal"}
                    </h3>
                </div>
                <div>
                    <div className="wrap-content">
                        <div>
                            <span>
                                타입
                                <div className='wrap-type'>
                                    {content?.types?.length > 0 && content.types.map((type, idx) => {
                                            const typeKey = type.type.name;
                                            console.log(typeColor[typeKey])
                                            return(
                                                    <div>
                                                        <img src={typeColor[typeKey].img}/>
                                                        <span>{typeColor[typeKey].name}</span>
                                                    </div>
                                            )
                                        })
                                    }
                                </div>
                            </span>
                            <span>키</span>
                            <span>분류</span>
                        </div>
                        <div>
                            <span>성별</span>
                            <span>몸무게</span>
                            <span>특성</span>
                        </div>
                    </div>
                    <form method="dialog">
                        <button onClick={onClose}>닫기</button>
                    </form>
                </div>
            </div>
        </div>
    </dialog>
  );
}