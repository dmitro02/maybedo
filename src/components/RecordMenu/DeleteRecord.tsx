import { useState, useRef } from "react"
import { IActions, Task } from "../../types"
import { RiDeleteBin7Fill } from 'react-icons/ri'
import { MdCheck, MdClose } from "react-icons/md"
import taskStore from "../../utils/taskStore"
import { useOutsideClickDetector } from '../../utils/customHooks'

type Props = {
    task: Task,
    actions: IActions
}

const DeleteRecord = ({ task, actions }: Props) => {
    const [ showDeleteConfirmation, setShowDeleteConfirmation ] = useState(false)

    const deleteRecord = () => {
        setShowDeleteConfirmation(false)
        taskStore.deleteTask(task)
        actions.triggerCascadingUpdate()
    }

    const openDeleteConfirmation = () => {
        setShowDeleteConfirmation(true)
    }

    const closeDeleteConfirmation = () => {
        setShowDeleteConfirmation(false)
    }

    const confirmRef = useRef(null)
    useOutsideClickDetector(confirmRef, closeDeleteConfirmation, showDeleteConfirmation)

    return (
        <>
            {showDeleteConfirmation 
                ?
                <div className="record-menu-row" ref={confirmRef}>
                    <div className="inline-menu-btn">
                        <MdCheck onClick={deleteRecord} />
                    </div>
                    <div className="inline-menu-btn">
                        <MdClose onClick={closeDeleteConfirmation} />
                    </div>
                </div>
                :
                <div 
                    onClick={openDeleteConfirmation} 
                    title="Delete task" 
                    className="record-menu-row"
                >
                    <RiDeleteBin7Fill />
                    <div className="menu-item-text">Delete</div>
                </div>
            }
        </>
    )
}

export default DeleteRecord
