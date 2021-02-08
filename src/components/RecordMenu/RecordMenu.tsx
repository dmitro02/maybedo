import React, { useRef, useState, memo } from 'react'
import { MdMoreVert } from "react-icons/md"
import { IActions, Task } from '../../types'
import { useOutsideClickDetector } from '../../utils/customHooks'
import { RiFileAddFill } from 'react-icons/ri'
import DeleteRecords from './DeleteRecords'
import Priority from './Priority'
import './RecordMenu.scss'

type Props = {
    task: Task,
    classes?: string[],
    actions: IActions,
    showSubtasks: () => void,
    isProject: boolean
}

const RecordMenu = (props: Props) => {
    const {
        task,
        classes = [],
        actions,
        showSubtasks,
        isProject
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

    let closeTimeout: any
    const handleMouseLeave = () => {
        closeTimeout = setTimeout(closeMenu, 500)
    }
    const handleMouseEnter = () => {
        clearTimeout(closeTimeout)
    }
    
    const hasSubtasks = !!task.tasks.length

    const hasCompleted = !!task.tasks.filter((it) => it.isDone).length

    const isRoot = !!!task.parent

    return (
        <div className={'record-menu-box ' + classes.join(' ')}>
            <MdMoreVert className="common-btn" onClick={openMenu} />
            {showMenu && <div 
                className="record-menu"
                ref={menuRef} 
                onMouseLeave={handleMouseLeave}
                onMouseEnter={handleMouseEnter}
            >
                {!task.isDone && !isRoot && <Priority 
                    task={task} 
                    actions={actions} 
                    closeMenu={closeMenu} 
                />}
                {!isProject && !task.isDone && !isRoot && <div 
                    className="record-menu-row" 
                    title="Add subtask" 
                    onClick={handleClickOnAddSubtask}
                >
                    <RiFileAddFill className="menu-item-icon" />
                    <div className="menu-item-text">Add</div>
                </div>}
                <DeleteRecords
                    task={task} 
                    actions={actions} 
                    isBulk
                    isDisabled={!hasCompleted || !hasSubtasks}
                    closeMenu={closeMenu}
                />
                {!isRoot && <DeleteRecords task={task} actions={actions} />}
            </div>}
        </div>
    )
}

export default memo(RecordMenu)
