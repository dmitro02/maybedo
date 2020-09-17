import React from 'react'
import './Modal.scss'
import { useTasksContext } from '../../contexts/TasksContext'
import { } from '../../contexts/actionCreators'

const Modal = () => {
    const [ store, dispatch ] = useTasksContext()

    if (!store.modal) return null

    return (
        <>
            <div className="modal-background" />
            <div className="modal-container">
                <div className="modal-dialog">
                    
                </div>
            </div>
        </>
    )
}

export default Modal