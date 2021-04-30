import { useState, memo, useEffect, useRef } from 'react'
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
            text,
            isDone,
            priority
        }
    } = props

    const hasSubtasks = metadata.hasChildren(id)
    const isProject = metadata.isProject(id)
    const isRoot = metadata.isRoot(id)

    const [ showSubtasks, setShowSubtasks ] = useState(false)
    const [ recordText, setRecordText ] = useState(text)

    /* 
    Record state is not updated while editing but content
    saved to the buffer and goes to state only after blur
    to avoid problems with handling caret position on rerender.  
    */
    const recordTextBuffer = useRef(text)

    // rerender record after updating from cloud 
    useEffect(() => setRecordText(text), [text])

    const updateTextFromTitle = (text: string) => {
        updateTask({ ...item, text})
        setRecordText(text)
    }

    const updateTextFromEditable = (text: string) => {
        updateTask({ ...item, text})
        recordTextBuffer.current = text
        isProject && updateTitle(text)
    }

    const updateTextFromBuffer = () => setRecordText(recordTextBuffer.current)

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
                onBlur={updateTextFromBuffer}
            >
                <div className="row-btns">
                    <CheckmarkButton 
                        actionOnClick={handleClickOnCheckbox} 
                        isChecked={isDone}
                        priority={priority}
                    />
                </div>
                <Editable 
                    text={recordText} 
                    saveContent={updateTextFromEditable} 
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
                        isTitle={isRoot}
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
