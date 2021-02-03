import React, { useRef, useState } from 'react'
import { MdMoreVert } from "react-icons/md"
import { IActions, Task } from '../../types'
import { useOutsideClickDetector } from '../../utils/customHooks'
import { RiFileAddFill } from 'react-icons/ri'
import DeleteRecords from './DeleteRecords'
import Priority from './Priority'
import './RecordMenu.scss'

type Props = {
    task: Task,
    classes: string[],
    actions: IActions,
    showSubtasks: () => void
}

const RecordMenu = (props: Props) => {
    const {
        task,
        classes,
        actions,
        showSubtasks
    } = props

    const [ showMenu, setShowMenu ] = useState(false)

    const openMenu = (e: any) => {
        e.stopPropagation() // prevent task selection on click
        setShowMenu(true)
    }

    const closeMenu = () => setShowMenu(false)

    const menuRef = useRef(null)
    useOutsideClickDetector(menuRef, closeMenu, showMenu)

    const handleClickOnAddSubtask = () => {
        closeMenu()
        showSubtasks()
    }

    return (
        <div className={'record-menu-box ' + classes.join(' ')}>
            <MdMoreVert className="common-btn" onClick={openMenu} />
            {showMenu && <div className="record-menu" ref={menuRef}>
                <Priority task={task} />
                <div 
                    className="record-menu-row" 
                    title="Add subtask" 
                    onClick={handleClickOnAddSubtask}
                >
                    <RiFileAddFill className="menu-item-icon" />
                    <div className="menu-item-text">Add</div>
                </div>
                <DeleteRecords task={task} actions={actions} isBulk closeMenu={closeMenu}/>
                <DeleteRecords task={task} actions={actions} />
            </div>}
        </div>
    )
}

export default RecordMenu
