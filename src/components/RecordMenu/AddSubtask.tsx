import { RiFileAddFill } from 'react-icons/ri'

type Props = {
    closeMenu: () => void
    showSubtasks: () => void
}

const AddSubtask = ({ closeMenu, showSubtasks }: Props) => {
    const handleClickOnAddSubtask = () => {
        closeMenu()
        showSubtasks()
    }

    return (
        <div 
            className="record-menu-row" 
            title="Add subtask" 
            onClick={handleClickOnAddSubtask}
        >
            <RiFileAddFill className="menu-item-icon" />
            <div className="menu-item-text">Add</div>
        </div>
    )
}

export default AddSubtask
