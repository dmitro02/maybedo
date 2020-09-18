import React from 'react'
import './Modal.scss'
import { useTasksContext } from '../../contexts/TasksContext'
import { setModal } from '../../contexts/actionCreators'

const Modal = () => {
    const [ store, dispatch ] = useTasksContext()

    if (!store.modal) return null

    const closeModal = () => dispatch(setModal(null))

    const { 
        text, 
        okAction = () => {},
        cancelAction = () => {},
    } = store.modal

    const handleClickOk = () => {
        closeModal()
        okAction()
    }

    const handleClickCancel = () => {
        closeModal()
        cancelAction()
    }

    return (
        <>
            <div className="modal-background" />
            <div className="modal-container">
                <div className="modal-dialog">
                    <div>{text}</div>
                    <div>
                        <button onClick={handleClickCancel}>Cancel</button>
                        <button onClick={handleClickOk}>OK</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Modal