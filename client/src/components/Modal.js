import React, { useState, useEffect } from 'react';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';

const Modal = (props) => {
    const {modalVisible, onClickOk = f => f, title='', label='', children  } = props
    const [visible, setVisible] = useState(false);
    
    useEffect(() => {
        if (modalVisible) {
          setVisible(modalVisible);
        }
      }, [modalVisible]);

    console.log('second modal exec', props, modalVisible, visible);
    return (
        <Rodal
                visible={modalVisible}
                onClose={() => setVisible(false)}
                animation='zoom'
                closeOnEsc
            >
                <div className="header">{title}</div>
                <div className="body">
                   {children}
                <button className="rodal-confirm-btn" onClick={() => onClickOk}>
                    ok
                </button>
                <button className="rodal-cancel-btn" onClick={() => setVisible(false)}>
                    close
                </button>
                </div>
            </Rodal>
    )
}

export default Modal;
