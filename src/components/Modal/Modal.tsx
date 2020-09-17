import React from 'react'
import './Modal.scss'

type Props = {
    children: React.ReactNode
}

const Modal = (props: Props) => {
    const { children } = props    

    return (
        <>
            <div className="modal-background" />
            <div className="modal-container">
                <div className="modal-dialog">
                    {children}
                </div>
            </div>
        </>
    )
}

export default Modal