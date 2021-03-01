import React, { useState, memo } from 'react'
import './Record.scss'
import { Task } from '../../types'
import SubTaskList from '../RecordList/SubTaskList'
import { 
    ExpandButton,
    CollapseButton,
    CheckmarkButton
 } from '../Buttons/Buttons'
import RecordMenu from '../RecordMenu/RecordMenu'
import Editable from './Editable'
import { useSubscribeWithForceUpdate } from '../../utils/Store'
import { selectTask } from '../../utils/Store'

type Props = { 
    item: Task, 
    isEditable?: boolean,
    isTitle?: boolean,
    isSelected?: boolean
}

const Record = (props: Props) => {
    const {
        isEditable = true,
        isTitle = false,
        isSelected = false,
        item,
        item: {
            id, 
            isDone,
            priority, 
            parent
        }
    } = props

    useSubscribeWithForceUpdate(item.id)

    const hasSubtasks = !!item.tasks.length

    const isProject = !!!item.parent?.parent

    const [ showSubtasks, setShowSubtasks ] = useState(item.isOpened && hasSubtasks)

    const handleClickOnRecord = () => { 
        if (isProject && parent && parent!.selectedSubTaskId !== id) {
            selectTask(item)
        }
    }

    const handleClickOnCheckbox = (e: any) => {
        e.stopPropagation()
        if (e.button === 0) { // left click only
            item.isDone = !item.isDone
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
        item.isOpened = true
    }

    const closeSubtasks = () => {
        setShowSubtasks(false)
        item.isOpened = false
    }

    const getSubtasksBtn = () => {
        const classNames = [ 'subtasks-btn' ]
        if (hasSubtasks && !showSubtasks) {
            return <ExpandButton action={openSubtasks} classNames={classNames} />
        }
        if (showSubtasks) {
            return <CollapseButton action={closeSubtasks} classNames={classNames} />
        }
        return null
    }

    return (
        <>
            <div 
                className={recordClassName}
                id={id} 
                onClick={handleClickOnRecord}
            >
                <div className="row-btns">
                    <CheckmarkButton 
                        actionOnClick={handleClickOnCheckbox} 
                        isChecked={isDone}
                        priority={priority}
                    />
                </div>
                <Editable task={item} isEditable={isEditable} />
                {/* DEBUG: display task ID for each record  */}
                {/* <span style={{fontSize: '10px'}}>{id}</span> */}
                <div className="row-btns">
                    {getSubtasksBtn()}
                    <RecordMenu 
                        task={item} 
                        showSubtasks={openSubtasks}
                        classes={[ hiddenBtnClassName ]}
                        isProject={isProject}
                    /> 
                </div>
            </div>
            {showSubtasks && <SubTaskList task={item} />}
        </>
    )
}

export default memo(Record)
