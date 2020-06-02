import React, { Fragment } from 'react';
import { connect, getIn } from 'formik';
import classNames from 'classnames'

const ErrorMessage = ({name, skipTouch, formik}) => {
    // No debería hacer getIn porque nuestro servidor devuelve un string
    // como key del path ejemplo codes[0].value[0] y no devuelve
    // la estructura anidada correspondiente con un diccionario con un array 
    // adentro etc 
    const error = formik.errors? formik.errors[name] : "";
    const touch = getIn(formik.touched, name);
    if (error && (touch || skipTouch)) {
        return (
            <Fragment> 
                <div className={classNames("no-form-control", { 'is-invalid': error})}> </div>
                <div className="invalid-feedback">{error}</div>
            </Fragment>
        )
    }
    return null
};

export default connect(ErrorMessage);