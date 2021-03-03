import { RiFileAddFill } from 'react-icons/ri'

type Props = {
    closeMenu: () => void
    showSubtasks: () => void
    isDisabled?: boolean
}

const AddSubtask = ({ closeMenu, showSubtasks, isDisabled = false }: Props) => {
    const handleClickOnAddSubtask = () => {
        closeMenu()
        showSubtasks()
    }

    const classes = [
        'record-menu-row',
        isDisabled ? 'disabled' : ''
    ].join(' ')

    return (
        <div 
            className={classes}
            title="Add subtask" 
            onClick={handleClickOnAddSubtask}
        >
            <RiFileAddFill className="menu-item-icon" />
            <div className="menu-item-text">Add</div>
        </div>
    )
}

export default AddSubtask
