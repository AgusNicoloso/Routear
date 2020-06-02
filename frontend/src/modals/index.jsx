import React, { Fragment } from 'react'
import { keyMap } from './keymaps'

// para agregaar un nuevo modal al sistema importarlo y agregalo uno abao
// del otro con su id correspondiente.
export function Modals(props) {
    return (
        <Fragment>
            { Object.keys(keyMap).map((key) => {
                const Modal = keyMap[key].modalClass
                return <Modal key={key} modalId={key}/>
            })}
        </Fragment>
    )
}
