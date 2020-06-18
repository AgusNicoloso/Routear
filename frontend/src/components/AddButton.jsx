import React, { Component, Children, Fragment, cloneElement } from 'react';
import {withModals} from "../contexts/ModalsContext";
import objectPath from "../libs/object-path";
import  { Plus } from 'react-feather'

const mapStateToProps = (state, ownProps) => {
    return {
        submitted: objectPath.get(state, `${ownProps.resource}.create.done`),
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {}
}

class AddButton extends Component {

    componentDidUpdate(prevProps) {
        const { submitted, onDone } = this.props;
        if (!prevProps.submitted && submitted === true && onDone) {
            onDone()
        }
    }
    
    handleClick = () => {
        console.log("ENTROO", this.props.resource, this.props)
        this.props.openModal(this.props.resource, {operation: 'create', initialValues: this.props.initialValues});
    }

    render() {
        const { children, disabled } = this.props;
        if (children) {
            return (
                <Fragment>
                    {Children.map(children, child => (
                      cloneElement(child, {
                        onClick: disabled? null : this.handleClick,
                      })))
                    }
                </Fragment>
            )
        }
        return <Plus size={24} className="ml-2 clickable" onClick={disabled ? null : this.handleClick} title={'Agregar'}/>
    }
}

export default withModals(AddButton);
