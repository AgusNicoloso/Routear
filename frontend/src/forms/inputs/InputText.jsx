import React, { Fragment, Component } from 'react';
import { connect, Field, getIn } from 'formik';
import ErrorMessage from '../ErrorMessage'
import classNames from 'classnames'
import {InputGroup, InputGroupAddon} from 'reactstrap';

class InputText extends Component {
    renderField = () => {
        const {formik, name, isSubmitting, placeholder, innerRef, password,
             disabled, submitOnChnage, prefix, notErrorMessage, className, ...others} = this.props
        const extraCalassNames = className ? className.split(' '): []
        return <Field  
            type={password?"password":"text"}
            name={name} 
            placeholder={placeholder}
            disabled={disabled || formik.isSubmitting}
            innerRef={innerRef}
            className={classNames("form-control", ...extraCalassNames, { 'is-invalid': getIn(formik.errors, name)})}
            value={getIn(formik.values, name) || ""}
            {...others}
        />
    }

    render() {
        const {name, prefix, notErrorMessage} = this.props
        return (
            <Fragment>
                {prefix ? 
                    <InputGroup>
                        {this.renderField()}
                        <InputGroupAddon addonType="append">{prefix}</InputGroupAddon>
                        <ErrorMessage name={name} />
                    </InputGroup>
                    : <Fragment>
                        {this.renderField()}
                        {!notErrorMessage && 
                            <ErrorMessage name={name}/>
                        }
                    </Fragment>
                    
                }
            </Fragment>
        )
    }
};

export default connect(InputText);