import { useRef, useState } from 'react'
import { MdMoreVert } from "react-icons/md"
import { IActions, Task } from '../../types'
import { useOutsideClickDetector } from '../../utils/customHooks'
import './RecordMenu.scss'
import { RiDeleteBinFill, RiFileAddFill } from 'react-icons/ri'
import DeleteRecord from '../Record/DeleteRecord'

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
            <MdMoreVert className="common-btn" onClick={openMenu}/>
            {showMenu && <div className="record-menu" ref={menuRef}>
                <div 
                    className="record-menu-row" 
                    title="Add subtasks" 
                    onClick={handleClickOnAddSubtask}
                >
                    <RiFileAddFill className="menu-item-icon" />
                    <div className="menu-item-text">Add</div>
                </div>
                <div className="record-menu-row" title="Delete completed subtasks">
                    <RiDeleteBinFill className="menu-item-icon"/>
                    <div className="menu-item-text">Clear</div>
                </div>
                <DeleteRecord task={task} actions={actions} />
            </div>}
        </div>
    )
}

export default RecordMenu
