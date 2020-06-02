import React, { Component, Fragment } from 'react';
import { Button, ModalHeader, ModalBody, ModalFooter, Form } from 'reactstrap';
import FullSpinner from "../components/FullSpinner";
import InlineSpinner from "../components/InlineSpinner";
import { Modal } from 'reactstrap';
import { withModal } from '../contexts/ModalsContext.jsx'
import ErrorMessage from '../forms/ErrorMessage';
  
class FormModal extends Component {
    componentWillUnmount() {
        clearTimeout(this.timerId);
    }


    componentDidUpdate(prevProps) {
      const { submitted, submitting, isModalOpen, closeModal } = this.props;
      if (prevProps.submitting && submitting === false) {
        this.props.onSubmitted()
      }
      if (!prevProps.submitted && submitted === true) {
        closeModal()
      }
      if (!prevProps.isModalOpen && isModalOpen) {
        this.timerId = setTimeout(this.focus, 500);
      }
    }

    focus = () => {
      const { isModalOpen, firstInput } = this.props;
      if (firstInput && firstInput.current) {
        firstInput.current.focus()
      } else if (isModalOpen){
        this.timerId = setTimeout(this.focus, 500); // (*)
      }
    }

    onClose = () => {
      this.props.toggleModal()
      this.props.onClose()
    }

    render () {
      const {isModalOpen, toggleModal, children, onSubmit, name, t, loading, modalLevel, dirty} = this.props;
      return (
        <Modal
          size="lg"
          isOpen={isModalOpen}
          toggle={toggleModal}
          fade={false}
          className={modalLevel <= 4 ? `p-${modalLevel}`: "p-5"}
          >
            {loading? 
              <ModalBody className="p-5"><FullSpinner/></ModalBody>:
              <Fragment>
                <ModalHeader toggle={toggleModal}>{name} 
                     
                     <ul className="nav list-inline ml-auto float-right">
                      { dirty && (
                        <li className="list-inline-item pl-2 right"><p className="mb-0"><small><em>({t('cambios sin guardar')})</em></small></p></li>
                      )}
                      { this.props.working > 0 && (
                          <li className="list-inline-item pl-2"> <InlineSpinner size={14} /> </li>
                      )}
                    </ul>
                </ModalHeader>
                <ModalBody>
                    <Form onSubmit={onSubmit}>
                        {children}
                        <input type="submit" className="hidden"/>
                        <ErrorMessage name="non_field_errors" skipTouch={true} />
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" type="submit"
                            onClick={onSubmit}>{'Guardar'}</Button>{' '}
                    <Button color="warning" className="text-white" onClick={this.onClose}>{'Cancelar'}</Button>
                </ModalFooter>
              </Fragment>
            }
        </Modal>
      );
    }
}

export default withModal(FormModal);
