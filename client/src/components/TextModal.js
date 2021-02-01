import React, {useState} from 'react';
import Modal from './Modal';

const TextModal = (props) => {
    const {text = '', label='', ...restProps} = props;
    console.log('Modal exec');
    return (
        <Modal {...restProps}>
            <div className="form-group">
                <label>{label}</label>
                {text}
            </div>  
        </Modal>
    )
}

export default TextModal