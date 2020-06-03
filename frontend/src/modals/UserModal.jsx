import React, { Component, Fragment } from 'react';
import InputText from '../forms/inputs/InputText'
import { withResourceModal }   from "../contexts/ResourceModalContext"
import LabelledGroup from '../forms/LabelledGroup'
import objectPath from "../libs/object-path";
import {searchResources} from "../flows/ResourceFlow";
import { connect } from 'react-redux'
import { Row, Col } from 'reactstrap'
import * as Yup from 'yup'

const mapStateToProps = (state) => {
    return {
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
    }
}
const mapPropsToValues = ({obj}) => {
    return {
            username: obj ? obj.username : '',
            first_name: obj ? obj.first_name : '',
            last_name: obj ? obj.last_name : '',
            email: obj ? obj.email : '',
            password: '',
            confirmPassword: '',
            roles: obj && obj.roles ? obj.roles: [],
            is_master: obj? obj.is_master: false,
    }
}

const validationSchema = (props) => {
    return Yup.object().shape({
        first_name: Yup.string()
            .required('El nombre es obligatorio'),
        username: Yup.string()
            .required('El usuario es obligatorio'),
        email: Yup.string()
            .required('El email es obligatorio')
            .email('El email ingresado no es válido'),
        password: Yup
            .string()
            .label('Contraseña')
            .min(2, 'Es demasiado corta...'),
        confirmPassword: Yup
            .string()
            .label('Confirmar contraseña')
            .test('passwords-match', 'Las contraseñas no coinciden', function(value) {
              return this.parent.password === value;
            }),
    })
}

class UserModal extends Component {

    constructor(props) {
        super(props)
        this.firstInput = React.createRef();
    }
    
    render () {
        return (
            <Fragment>
                <Row>
                    <Col>
                        <LabelledGroup htmlFor="first_name" name={'Nombre'}>
                            <InputText name="first_name" innerRef={this.firstInput}/>
                        </LabelledGroup>
                    </Col>
                    <Col>
                        <LabelledGroup htmlFor="last_name" name={'Apellido'}>
                            <InputText name="last_name"/>
                        </LabelledGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <LabelledGroup htmlFor="username" name={'Usuario'}>
                            <InputText name="username"/>
                        </LabelledGroup>
                    </Col>
                    <Col>
                        <LabelledGroup htmlFor="email" name={'Email'}>
                            <InputText name="email"/>
                        </LabelledGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <LabelledGroup htmlFor="password" name={'Contraseña'}>
                            <InputText name="password" password/>
                        </LabelledGroup>
                    </Col>
                    <Col>
                        <LabelledGroup htmlFor="confirmPassword" name={'Confirmar Contraseña'}>
                            <InputText name="confirmPassword" password/>
                        </LabelledGroup>
                    </Col>
                </Row>

            </Fragment>
        );
    }
}

export default withResourceModal(
    mapPropsToValues, 
    "Usuario",
    "",
    validationSchema,
    (UserModal)
);

