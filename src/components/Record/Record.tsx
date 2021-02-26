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
import taskStoreOld from '../../utils/taskStore'
import RecordMenu from '../RecordMenu/RecordMenu'
import Editable from './Editable'
import { useForceUpdate, useTaskStore } from '../../utils/customHooks'

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
            parent 
        }
    } = props

    const forceUpdate = useForceUpdate()

    const callback = (id: string) => {
        if (id === item.id && isProject) forceUpdate()
    }
    
    useTaskStore(callback)

    const { store, actions } = useTasksContext()

    const hasSubtasks = !!item.tasks.length

    const isProject = !!!item.parent?.parent

    const [ showSubtasks, setShowSubtasks ] = useState(item.isOpened && hasSubtasks)

    const handleClickOnRecord = () => { 
        if (isProject && parent!.selectedSubTaskId !== id) {
            taskStoreOld.selectTask(item)
            store.showSidebar && actions.setShowSidebar(false)
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
                        classes={[ isDone ? 'prio-0' : 'prio-' + item.priority ]}
                    />
                </div>
                <Editable 
                    task={item} 
                    isEditable={isEditable}
                    isProject={isProject}
                 />
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
