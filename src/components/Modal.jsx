import React, { useEffect, useRef } from 'react';
import '../css/Modal.css';

export default function Modal({ isOpen, onClose, content, typeColor }) {
  const dialogRef = useRef();
  const femaleRate = "./src/images/icon_woman.png";
  const maleRate = "./src/images/icon_man.png";
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
                        <span>NO.{String(content?.text).padStart(4, '0')}</span>
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
                            <span>키
                                <div>
                                {(content?.height * 0.1).toFixed(1)}m
                                </div>
                            </span>
                            <span>분류
                                <div>
                                    {content?.genera}
                                </div>
                            </span>
                        </div>
                        <div>
                            <span>성별
                                <div className='wrap-gender'>
                                    {content?.femaleRate === 100 ? (
                                            <img src={femaleRate} alt="여자" width={20} />
                                        ) : content?.maleRate === 100 ? (
                                            <img src={maleRate} alt="남자" width={20} />
                                        ) : (
                                            <>
                                            <img src={maleRate} alt="남자" width={20} style={{ marginRight: '4px' }} />
                                            <img src={femaleRate} alt="여자" width={20} />
                                            </>
                                    )}
                                </div>
                            </span>
                            <span>몸무게<div>{(content?.weight * 0.1).toFixed(1)}Kg</div></span>
                            <span>특성
                                <div>
                                    {content?.abilities?.join(' ')}
                                </div>
                            </span>
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