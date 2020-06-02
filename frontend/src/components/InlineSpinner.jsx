import React from 'react';
import { ClipLoader } from 'react-spinners';


class InlineSpinner extends React.Component {
    render() {
        return (
            <ClipLoader sizeUnit={"px"} size={this.props.size} color={'#780206'} />
        )
    }
}

export default InlineSpinner;