
import React, { Component, createContext } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { keyMap } from '../modals/keymaps'


export const ModalsContext = createContext({
  isOpen: null,
  toggleModal: (id) => null,
  openModal: (id, data) =>  null,
  closeModal: (id) => null,
  openData: null,
  level: null,
});

export default class ModalsProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: {},
      toggleModal: this.toggleModal,
      openModal: this.openModal,
      closeModal: this.closeModal,
      openData: {},
      level: -1,
    };
  }

  setCloseModal = (id) => {
      this.setState(prevState => ({
          isOpen: Object.assign({}, prevState.isOpen, {[id]:undefined}),
          level: prevState.level > 1 ? prevState.level - 1 : 0
      }));
  }

  setOpenModal = (id, data) => {
    console.log(keyMap, id)
    this.setState(prevState => {
      let answer = {
        isOpen: Object.assign({}, prevState.isOpen, {[id]: true}),
        level: prevState.level + 1
      }
      if (data) {
        answer.openData = Object.assign({}, prevState.openData, {[id]:data})
      }
      return answer
    })
  }

  toggleModal = (id) => {
    if (this.state.isOpen[id] !== undefined) {
        this.setCloseModal(id)
    } else {
        this.setOpenModal(id)
    }
  }

  openModal = (id, data) => {
    if (this.state.isOpen[id] === undefined) {
      this.setOpenModal(id, data)
    }
  }

  closeModal = (id) => { 
    if (this.state.isOpen[id] !== undefined) {
      this.setCloseModal(id)
    }
  }

  getKeyMap = (keyMap) => {
    // if (this.props.ware_types.length > 0) {
    //     keyMap.wares.sequences = []
    //     this.props.ware_types.forEach((wt) => {
    //         keyMap.wares.sequences.push("alt+w " + wt.shortcut_key)
    //     })
    // }

    // if (this.props.variant_types.length > 0) {
    //     keyMap.variants.sequences = []
    //     this.props.variant_types.forEach((wt) => {
    //         keyMap.variants.sequences.push("alt+v " + wt.shortcut_key)
    //     })
    // }

    // if (this.props.lot_types.length > 0) {
    //     keyMap.lots.sequences = []
    //     this.props.lot_types.forEach((wt) => {
    //         keyMap.lots.sequences.push("alt+l " + wt.shortcut_key)
    //     })
    // }

    return keyMap
  }

  getHandlers = (keyMap) => {
    return Object.keys(keyMap).reduce((handlers, key) => { 
      handlers[key] = (e) => {
        this.openModal(key, {key: e.key})
      }
      return handlers
    }, {})
  }

  render() {
    const { children } = this.props;
    const newKeyMap = this.getKeyMap(keyMap)
    const newHandlers = this.getHandlers(newKeyMap)
    console.log(this.state)
    return (
      <ModalsContext.Provider value={this.state}>
        <GlobalHotKeys keyMap={newKeyMap} handlers={newHandlers} allowChanges={true}/>
        {children}
      </ModalsContext.Provider>
    );
  }
}


export function withModals(WrappedComponent) {
    return class extends Component {
        render () {
            return (
                <ModalsContext.Consumer>
                  {({isOpen, toggleModal, openModal, closeModal, openData }) => (
                    <WrappedComponent {...this.props} 
                      isModalOpen={isOpen} 
                      toggleModal={toggleModal} 
                      openModal={openModal}
                      closeModal={closeModal}
                      openData={openData}
                      modalLevel={isOpen}
                    />
                  )}
                </ModalsContext.Consumer>
            );
        }
    }
}

export function withModal(WrappedComponent) {
    return class extends Component {
        render () {
            return (
                <ModalsContext.Consumer>
                  {({isOpen, toggleModal, openModal, closeModal, openData}) => (
                    <WrappedComponent {...this.props} 
                      isModalOpen={isOpen[this.props.modalId] !== undefined} 
                      toggleModal={() => toggleModal(this.props.modalId)}
                      openModal={openModal}
                      closeModal={() => closeModal(this.props.modalId)}
                      openData={openData[this.props.modalId] || {}}
                      modalLevel={isOpen[this.props.modalId] || 0}
                    />
                  )}
                </ModalsContext.Consumer>
            );
        }
    }
}