import React from 'react';
import FormGroup from './FormGroup'

const LabelledGroup = ({htmlFor, name, children}) => {
    return (
        <FormGroup>
            <label htmlFor={htmlFor}>{name}:</label>
            {children}
        </FormGroup>
    )
};

export default LabelledGroup;