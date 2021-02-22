import React, { useState, memo } from 'react'
import './Record.scss'
import { Task } from '../../types'
import { useTasksContext } from '../../contexts/TasksContext'
import SubTaskList from '../RecordList/SubTaskList'
import { 
    ExpandButton,
    CollapseButton,
    CheckmarkButton
 } from '../Buttons/Buttons'
 import taskStore from '../../utils/taskStore'
import RecordMenu from '../RecordMenu/RecordMenu'
import Editable from './Editable'

type Props = { 
    item: Task, 
    isEditable?: boolean,
    isTitle?: boolean
}

const Record = (props: Props) => {
    const {
        isEditable = true,
        isTitle = false,
        item,
        item: {
            id, 
            isDone: initialState, 
            parent 
        }
    } = props

    const { store, actions } = useTasksContext()

    const isSelected = parent && id === parent.selectedSubTaskId && !isTitle

    const hasSubtasks = !!item.tasks.length

    const isProject = !!!item.parent?.parent

    const [ isDone, setIsDone ] = useState(initialState)

    const [ showSubtasks, setShowSubtasks ] = useState(item.isOpened && hasSubtasks)

    const handleClickOnRecord = () => { 
        if (!isProject) return

        if (parent && parent.selectedSubTaskId !== id) {
            taskStore.selectTask(item)
            actions.triggerCascadingUpdate() 
        }

        store.showSidebar && actions.setShowSidebar(false)
    }

    const handleMouseDownOnCheckbox = (e: any) => {
        e.stopPropagation()
        if (e.button === 0) { // left click only
            setIsDone((prevState) => item.isDone = !prevState)
            taskStore.updateTask()
        }
    }

    const handleMouseUpOnCheckbox = (e: any) => {
        e.stopPropagation()
        if (e.button === 0) { // left click only
            actions.triggerCascadingUpdate()
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
                        actionOnMouseDown={handleMouseDownOnCheckbox} 
                        actionOnMouseUp={handleMouseUpOnCheckbox}
                        isChecked={isDone}
                        classes={[ isDone ? 'prio-0' : 'prio-' + item.priority ]}
                    />
                </div>
                <Editable 
                    task={item} 
                    isEditable={isEditable}
                    isProject={isProject}
                    actions={actions}
                 />
                <div className="row-btns">
                    {getSubtasksBtn()}
                    <RecordMenu 
                        task={item} 
                        actions={actions}
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
