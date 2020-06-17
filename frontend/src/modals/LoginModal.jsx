import React, { Component, Fragment } from 'react';
import InputText from '../forms/inputs/InputText'
import { withResourceModal }   from "../contexts/ResourceModalContext"
import LabelledGroup from '../forms/LabelledGroup'
import objectPath from "../libs/object-path";
import {searchResources} from "../flows/ResourceFlow";
import { connect } from 'react-redux'
import { Row, Col } from 'reactstrap'
import * as Yup from 'yup'
import GoogleBtn from '../components/GoogleBtn';

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
         email: obj ? obj.email : '',
         password: '',
   } 
}

const validationSchema = (props) => {
    return Yup.object().shape({
        email: Yup.string()
            .required('El email es obligatorio')
            .email('El email ingresado no es válido'),
        password: Yup
            .string()
            .required('La contraseña es obligatoria')
            .label('Contraseña'),
    })
}

class LoginModal extends Component {

    constructor(props) {
        super(props)
        this.firstInput = React.createRef();
    }

   openUserModal = () => {
      this.props.openModal('users', {})
   }
    
    render () {
        return (
            <Fragment>
                <Row>
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
                </Row>
                <Row>
                    <Col>
                        <div className="clickable" onClick={this.openUserModal}>{"Registrarse"}</div>
                    </Col>
                </Row>
                <GoogleBtn/>

            </Fragment>
        );
    }
}

export default withResourceModal(
    mapPropsToValues, 
    "Login",
    "",
    validationSchema,
    connect(mapStateToProps, mapDispatchToProps)(LoginModal)
);

