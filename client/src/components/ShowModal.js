import React, {useState} from 'react';
import Rodal from 'rodal';

const ShowModal = (props) => {
    const [visible, setVisible] = useState(false);

    const show = () => {
        setVisible(true);
    }
    
    const hide = () => {
        setVisible(false);
    }

    return (
        <div>
          <button onClick={show}>show</button>
  
          <Rodal visible={visible} onClose={this.hide.bind(this)}>
            <div>Content</div>
          </Rodal>
        </div>
      );
} 

export default ShowModal;