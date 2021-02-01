import React, {useState} from 'react';
import Modal from './Modal';

const InputModal = (props) => {
    const [value, setValue] = useState('');

    return (
        <Modal {...props}>
            <div className="form-group">
                <label>Enter Coupon:</label>
                <input
                    type="text"
                    value={value}
                    name="modalInputName"
                    onChange={e => setValue(e.target.value)}
                    className="form-control"
            />
            </div>  
        </Modal>
    )  
};

export default InputModal;



