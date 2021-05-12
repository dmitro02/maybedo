import { useState } from 'react'
import './Record.scss'
import Task from '../../classes/Task'
import CheckmarkButton from '../Buttons/CheckmarkButton'
import { MdExpandLess, MdExpandMore } from 'react-icons/md'
import RecordMenu from '../RecordMenu/RecordMenu'
import Editable from './Editable'
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

    const updateTextFromTitle = (text: string) => {
        update({ ...item, text})
    }

    const updateTextFromEditable = (text: string) => {        
        update({ ...item, text})
        isProject && notify(Events.SetTitleByProject + id, text)
    }

    useEvent(Events.SetProjectByTitle + id, updateTextFromTitle)
    
    const handleClickOnRecord = () => { 
        if (isProject && !isRoot) store.selectedProjectId = id
    }

    const handleClickOnCheckbox = (e: any) => {
        e.stopPropagation()
        if (e.button === 0) { // left click only            
            update({ ...item, isDone: !item.isDone})
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
                    onInput={updateTextFromEditable} 
                    isEditable={isEditable}
                    getFocus={isFocused}
                    classes={[ 'item-content' ]}
                />
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

export default Record
