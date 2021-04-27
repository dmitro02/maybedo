import { useState, memo, useEffect } from 'react'
import './Record.scss'
import Task from '../../classes/Task'
import CheckmarkButton from '../Buttons/CheckmarkButton'
import { MdExpandLess, MdExpandMore } from 'react-icons/md'
import RecordMenu from '../RecordMenu/RecordMenu'
import Editable from './Editable'
import { updateTask } from '../../services/taskService'
import RecordList from '../RecordList/RecordList'
import { store, useEvent, notify, Events } from '../../classes/Store'
import metadata from '../../classes/Metadata'

type Props = { 
    item: Task, 
    isEditable?: boolean,
    isSelected?: boolean,
    update?: (task: Task) => void,
    remove?: (task: Task) => void,
    isFocused?: boolean
}

const Record = (props: Props) => {
    const {
        isEditable = true,
        isSelected = false,
        isFocused = false,
        item,
        update = () => {},
        remove = () => {},
        item: {
            id, 
            isDone,
            priority
        }
    } = props

    const hasSubtasks = metadata.hasChildren(id)
    const isProject = metadata.isProject(id)
    const isRoot = metadata.isRoot(id)

    const [ showSubtasks, setShowSubtasks ] = useState(false)
    const [ text, setText ] = useState(item.text)

    // rerender record after updating from cloud 
    useEffect(() => setText(item.text), [item.text])

    const  updateTextFromTitle = (text: string) => {
        updateTask({ ...item, text})
        setText(text)
    }

    const updateTextFromEditable = (text: string) => {
        updateTask({ ...item, text})
        isProject && updateTitle(text)
    }

    useEvent(Events.SetProjectByTitle + id, updateTextFromTitle)

    const updateTitle = (text: string) => notify(Events.SetTitleByProject + id, text)
    
    const handleClickOnRecord = () => { 
        if (isProject && !isRoot) store.selectedProjectId = id
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
                    update={updateTextFromEditable} 
                    isEditable={isEditable}
                    getFocus={isFocused}
                    classes={[ 'item-content' ]}
                />
                {/* DEBUG: display task ID for each record  */}
                {/* <span style={{fontSize: '10px'}}>{id}</span> */}
                <div className="row-btns">
                    {getSubtasksBtn()}
                    <RecordMenu 
                        task={item} 
                        showSubtasks={openSubtasks}
                        classes={[ hiddenBtnClassName ]}
                        isProject={isProject}
                        isRoot={isRoot}
                        update={update}
                        remove={remove}
                    /> 
                </div>
            </div>
            {showSubtasks && 
                <RecordList 
                    classNames={['subtasks-list']}
                    rootId={id}
                />
            }
        </>
    )
}

export default memo(Record)
