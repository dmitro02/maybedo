import { useState, useRef } from "react"
import { RiDeleteBin7Fill, RiDeleteBinFill } from 'react-icons/ri'
import { MdCheck, MdClose } from "react-icons/md"
import { useOutsideClickDetector } from '../../utils/customHooks'
import Task from "../../classes/Task"
import { notify } from "../../classes/Store"

type Props = {
    task: Task,
    isBulk?: boolean,
    isDisabled?: boolean,
    closeMenu?: () => void
    remove: (task: Task) => void
}

const DeleteRecords = (props: Props) => {
    const { 
        task, 
        isBulk = false, 
        isDisabled = false,
        closeMenu = () => {},
        remove
     } = props

    const [ showDeleteConfirmation, setShowDeleteConfirmation ] = useState(false)

    const deleteRecord = (e: any) => {
        e.stopPropagation()
        setShowDeleteConfirmation(false)
        remove(task)
    }

    const deleteCompleted = (e: any) => {
        e.stopPropagation()
        setShowDeleteConfirmation(false)
        notify('deleteCompleted' + task.id)
        closeMenu()
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

    const classNames = [ 'record-menu-row' ]
    isDisabled && classNames.push('disabled')

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
                    className={classNames.join(' ')}
                >
                    {icon}
                    <div className="menu-item-text">{text}</div>
                </div>
            }
        </>
    )
}

export default DeleteRecords
