import { useRef, useState } from 'react'
import { MdMoreVert } from "react-icons/md"
import Task from '../../classes/Task'
import { useOutsideClickDetector } from '../../utils/customHooks'
import DeleteRecords from './DeleteRecords'
import Priority from './Priority'
import './RecordMenu.scss'
import AddSubtask from './AddSubtask'

type Props = {
    task: Task,
    classes?: string[],
    showSubtasks: () => void,
    update: (task: Task) => void,
    remove: (task: Task) => void,
    isProject: boolean
}

const RecordMenu = (props: Props) => {
    const {
        task,
        classes = [],
        showSubtasks,
        update,
        remove,
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

    let closeTimeout: any
    const handleMouseLeave = () => {
        closeTimeout = setTimeout(closeMenu, 500)
    }
    const handleMouseEnter = () => {
        clearTimeout(closeTimeout)
    }
    
    const hasSubtasks = !!task.tasks.length

    const isRoot = task.id === '0'

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
                    closeMenu={closeMenu} 
                    update={update}
                />}
                {!isProject && !task.isDone && !isRoot && <AddSubtask 
                    closeMenu={closeMenu}
                    showSubtasks={showSubtasks}
                    isDisabled={hasSubtasks}
                />}
                <DeleteRecords
                    task={task} 
                    isBulk
                    isDisabled={!hasSubtasks}
                    closeMenu={closeMenu}
                    remove={remove}
                />
                {!isRoot && 
                    <DeleteRecords 
                        task={task}
                        remove={remove}
                    />
                }
            </div>}
        </div>
    )
}

export default RecordMenu
