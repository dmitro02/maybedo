import { useState, memo } from 'react'
import './Record.scss'
import Task from '../../classes/Task'
import CheckmarkButton from '../Buttons/CheckmarkButton'
import { MdExpandLess, MdExpandMore } from 'react-icons/md'
import RecordMenu from '../RecordMenu/RecordMenu'
import Editable from './Editable'
import { updateTask } from '../../utils/taskService'
import RecordList from '../RecordList/RecordList'
import notifier, { Events, useSubscribe } from '../../classes/Notifier'

type Props = { 
    item: Task, 
    parent?: Task,
    isEditable?: boolean,
    isTitle?: boolean,
    isSelected?: boolean,
    update?: (task: Task) => void,
    remove?: (task: Task) => void,
    selectProject?: (id: string) => void
}

const Record = (props: Props) => {
    const {
        isEditable = true,
        isTitle = false,
        isSelected = false,
        item,
        update = () => {},
        remove = () => {},
        selectProject,
        item: {
            id, 
            isDone,
            priority, 
            isProject,
            hasSubtasks
        }
    } = props

    const [ showSubtasks, setShowSubtasks ] = useState(item.isOpened && hasSubtasks)

    const [ text, setText ] = useState(item.text)

    useSubscribe(Events.UpdateTitle, (data) => {
        if (!isTitle && id === data.id) setText(data.text)
    });

    const handleClickOnRecord = () => { 
        if (isProject && selectProject) {
            selectProject(item.id)
        }
    }

    const handleClickOnCheckbox = (e: any) => {
        e.stopPropagation()
        if (e.button === 0) { // left click only
            item.isDone = !item.isDone
            update(item)
        }
    }

    const recordClassName = [
        'record', 
        isSelected ? 'record-selected' : '',
        !isEditable ? 'read-only' : '',
        isTitle ? 'title' : '',
        isProject? 'project' : '',
        isDone ? 'item-done' : ''
    ].join(' ')
        
    const hiddenBtnClassName = window.iAmRunningOnMobile ? '' : 'hidden-btn' 

    const openSubtasks = () => {
        setShowSubtasks(true)
    }

    const closeSubtasks = () => {
        setShowSubtasks(false)
    }

    const getSubtasksBtn = () => {
        const classes = "common-btn subtasks-btn"
        if (hasSubtasks && !showSubtasks) {
            return <MdExpandMore onClick={openSubtasks} className={classes} />
        }
        if (showSubtasks) {
            return <MdExpandLess onClick={closeSubtasks} className={classes} />
        }
        return null
    }

    const updateText = (text: string) => {
        item.text = text
        updateTask(item)
        isTitle && notifier.notify(Events.UpdateTitle, { id, text })
    }

    return (
        <>
            <div 
                className={recordClassName}
                onClick={handleClickOnRecord}
            >
                <div className="row-btns">
                    <CheckmarkButton 
                        actionOnClick={handleClickOnCheckbox} 
                        isChecked={isDone}
                        priority={priority}
                    />
                </div>
                <Editable 
                    text={text} 
                    update={updateText} 
                    isEditable={isEditable}
                    getFocus={item.isNew}
                />
                {/* DEBUG: display task ID for each record  */}
                {/* <span style={{fontSize: '10px'}}>{id}</span> */}
                <div className="row-btns">
                    {getSubtasksBtn()}
                    <RecordMenu 
                        task={item} 
                        showSubtasks={openSubtasks}
                        classes={[ hiddenBtnClassName ]}
                        isProject={!!isProject}
                        update={update}
                        remove={remove}
                    /> 
                </div>
            </div>
            {showSubtasks && 
                <RecordList 
                    classNames={['subtasks-list']}
                    rootId={item.id}
                />
            }
        </>
    )
}

export default memo(Record)
