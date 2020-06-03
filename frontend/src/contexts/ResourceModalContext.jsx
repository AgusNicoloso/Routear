import React, { Component } from "react";
import FormModal from '../modals/FormModal'
import { connect } from 'react-redux'
import objectPath from '../libs/object-path'
import { createResource, updateResource } from '../flows/ResourceFlow'
import { withModal } from '../contexts/ModalsContext.jsx'
import { withFormik } from 'formik'

const mapStateToProps = (state, ownProps) => {
    let opPath = '';
    let obj = undefined;
    let objLoading = false;
    const operation = ownProps.openData.operation
    switch (operation) {
        case "create": 
            opPath = 'create';
            break;
        case "update":
            opPath = `objects.${ownProps.openData.objId}.${operation}`;
            obj = objectPath.get(state, `${ownProps.modalId}.objects.${ownProps.openData.objId}.body`);
            objLoading = obj === undefined
            break;
        case "clone":
            opPath = 'create';
            obj = objectPath.get(state, `${ownProps.modalId}.objects.${ownProps.openData.objId}.body`);
            objLoading = obj === undefined
            break;
        default:
            opPath = '';
            obj = undefined;
            objLoading = false
    }
    return {
        serverErrors: objectPath.get(state, `${ownProps.modalId}.${opPath}.error.errors`, undefined),
        submitting: objectPath.get(state, `${ownProps.modalId}.${opPath}.working`) > 0,
        submitted: objectPath.get(state, `${ownProps.modalId}.${opPath}.done`),
        objLoading: objLoading,
        obj: obj,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        createResource: (body) => dispatch(createResource(ownProps.modalId, body)),
        updateResource: (body, id) => dispatch(updateResource(ownProps.modalId, id, body))
    }
}

export function withFormModal(mapPropsToValues, validationSchema, WrappedComponent) {
    const answer = class extends Component {
        onSubmitted = () => {
          const { setSubmitting, setErrors, serverErrors, resetForm} = this.props
          setSubmitting(false); 
          if (serverErrors) {
            setErrors(serverErrors)
          } else {
            resetForm()
          }
        }

        render () {
            return <WrappedComponent 
                operation={this.props.openData.operation}
                onSubmitted={this.onSubmitted}
                {...this.props} 
            />
        }
    }
    return withModal((withFormik({ 
        validationSchema: validationSchema,
        handleSubmit: (values, { isSubmitting, props }) => {
          if (!isSubmitting) {
              const { openData, obj, modalId } = props;
              const operation = openData.operation
              if (operation === 'create' || operation === 'clone') {
                  console.log("ENTROO", createResource)
                    // var url = "http://localhost:3001/users/";
                    // var method = "POST";
                    // var postData = values;
                    // var shouldBeAsync = true;
                    // var request = new XMLHttpRequest();
                    // request.onload = function () {z
                    //     var status = request.status; // HTTP response status, e.g., 200 for "200 OK"
                    //     var data = request.responseText; // Returned data, e.g., an HTML document.
                    // }
                    // request.open(method, url, shouldBeAsync);

                    // request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    // request.send(postData);
                createResource(modalId, values)
              } else if (operation === 'update') {
                updateResource(values, obj.id)
              }
          }
        },
        mapPropsToValues:mapPropsToValues
    })(answer)))
}

export function withResourceModal(mapPropsToValues, name, description, validationSchema, WrappedComponent) {
    const answer = class extends Component {
        componentDidUpdate(prevProps) {
            if ( 
                (this.props.obj === undefined && prevProps.obj !== undefined) ||
                (this.props.obj !== undefined && prevProps.obj === undefined) || 
                (this.props.obj !== undefined && prevProps.obj !== undefined && prevProps.obj.id !== this.props.obj.id ) 
            ) {
                this.props.resetForm(mapPropsToValues(this.props))
            }
        }

        getActionName = (operation) => {
            switch (operation) {
                case 'create':
                    return 'Crear';
                case 'update':
                    return 'Editar';
                case 'clone':
                    return 'Clonar';
                default:
                    return "";

            }
        }

        render () {
            const { modalId, submitted, dirty, resetForm, submitting, handleSubmit, objLoading, onSubmitted, operation} = this.props
            return (
              <FormModal
                submitted={submitted}
                submitting={submitting}
                modalId={modalId}
                onClose={() => resetForm()}
                dirty={dirty}
                onSubmit={handleSubmit}
                name={`${this.getActionName(operation)} ${name}`}
                loading={objLoading}
                description={description}
                onSubmitted={onSubmitted}
                operation={operation}
              >
                <WrappedComponent
                  {...this.props}
                />
              </FormModal>
            )
        }
    }
    return withFormModal(
        mapPropsToValues,
        validationSchema,
        answer,
    )
}