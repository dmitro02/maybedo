import React, { useState, useRef } from "react"
import { IActions, Task } from "../../types"
import { RiDeleteBin7Fill, RiDeleteBinFill } from 'react-icons/ri'
import { MdCheck, MdClose } from "react-icons/md"
import taskStore from "../../utils/taskStore"
import { useOutsideClickDetector } from '../../utils/customHooks'

type Props = {
    task: Task,
    actions: IActions,
    isBulk?: boolean,
    closeMenu?: () => void
}

const DeleteRecords = (props: Props) => {
    const { 
        task, 
        actions, 
        isBulk = false, 
        closeMenu = () => {}
     } = props
     
    const [ showDeleteConfirmation, setShowDeleteConfirmation ] = useState(false)

    const deleteRecord = () => {
        setShowDeleteConfirmation(false)
        taskStore.deleteTask(task)
        actions.triggerCascadingUpdate()
    }

    const deleteCompleted = () => {
        setShowDeleteConfirmation(false)
        taskStore.deleteCompletedSubtasks(task)
        closeMenu()
        actions.triggerCascadingUpdate()
    }

    const openDeleteConfirmation = (e: any) => {
        e && e.stopPropagation()
        setShowDeleteConfirmation(true)
    }

    const closeDeleteConfirmation = (e: any) => {
        e && e.stopPropagation()
        setShowDeleteConfirmation(false)
    }

    const confirmRef = useRef(null)
    useOutsideClickDetector(confirmRef, closeDeleteConfirmation, showDeleteConfirmation)

    const configSingle = {
        icon: <RiDeleteBin7Fill />,
        text: 'Delete',
        tooltip: 'Delete task',
        deleteAction: deleteRecord
    }
    
    const configBulk = {
        icon: <RiDeleteBinFill />,
        text: 'Clear',
        tooltip: 'Delete completed subtasks',
        deleteAction: deleteCompleted
    }

    const { 
        icon, 
        text, 
        tooltip, 
        deleteAction 
    } = isBulk ? configBulk : configSingle

    return (
        <>
            {showDeleteConfirmation 
                ?
                <div className="record-menu-row" ref={confirmRef}>
                    <div className="inline-menu-btn">
                        <MdCheck onClick={deleteAction} />
                    </div>
                    <div className="inline-menu-btn">
                        <MdClose onClick={closeDeleteConfirmation} />
                    </div>
                </div>
                :
                <div 
                    onClick={openDeleteConfirmation} 
                    title={tooltip} 
                    className="record-menu-row"
                >
                    {icon}
                    <div className="menu-item-text">{text}</div>
                </div>
            }
        </>
    )
}

export default DeleteRecords
