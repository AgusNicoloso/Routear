import React from 'react';
import { ClipLoader } from 'react-spinners';


class FullSpinner extends React.Component {
    render() {
        return (
            <div className='sweet-loading'>
                <ClipLoader
                    sizeUnit={"px"}
                    size={60}
                    color={'#FF586B'}
                />
            </div> 
        )
    }
}

export default FullSpinner;