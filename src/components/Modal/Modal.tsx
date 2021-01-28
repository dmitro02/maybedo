import React from 'react'
import './Modal.scss'
import { useTasksContext } from '../../contexts/TasksContext'
import Fog from '../Fog/Fog'
import { CloseButton, ConfirmButton } from '../Buttons/Buttons'

const Modal = () => {
    const { store: { modal }, actions } = useTasksContext()

    if (!modal) return null

    const { 
        text, 
        okAction = () => {},
        cancelAction = () => {},
    } = modal

    const closeModal = () => actions.setModal(null)

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
            <Fog isDisplayed={true} />
            <div className="modal-container">
                <div className="modal-dialog">
                    <div>{text}</div>
                    <div className="modal-btns">
                        <CloseButton action={handleClickCancel} />
                        <ConfirmButton action={handleClickOk} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Modal