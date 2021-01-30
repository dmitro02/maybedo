import { useRef, useState } from 'react'
import { MdMoreVert, MdDelete } from "react-icons/md";
import { IActions, Task } from '../../types'
import { useOutsideClickDetector } from '../../utils/customHooks'
import './RecordMenu.scss'

type Props = {
    task: Task,
    actions: IActions
}

const RecordMenu = ({task, actions}: Props) => {
    const [ showMenu, setShowMenu ] = useState(false)

    const openMenu = () => setShowMenu(true)
    const closeMenu = () => setShowMenu(false)

    const menuRef = useRef(null)
    useOutsideClickDetector(menuRef, closeMenu, showMenu)

    return (
        <div className="record-menu-box">
            <MdMoreVert className="common-btn" onClick={openMenu}/>
            {showMenu && <div className="record-menu" ref={menuRef}>
                <div className="record-menu-row">
                    <MdDelete />
                    <div>Delete</div>
                </div>
            </div>}
        </div>
    )
}

export default RecordMenu
