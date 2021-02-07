import React, { useState, memo } from 'react'
import './Record.scss'
import { Task } from '../../types'
import { useTasksContext } from '../../contexts/TasksContext'
import SubTaskList from '../SubTaskList/SubTaskList'
import { isMobile } from '../../utils/commonUtils'
import { 
    ExpandButton,
    CollapseButton,
    CheckmarkButton
 } from '../Buttons/Buttons'
 import taskStore from '../../utils/taskStore'
import RecordMenu from '../RecordMenu/RecordMenu'
import Editable from './Editable'

export type RecordConfig = {
    isEditable?: boolean
    isTitle?: boolean
}

const IS_MOBILE = isMobile()

type Props = { 
    item: Task, 
    config?: RecordConfig, 
}

const Record = ({ item, config = {}}: Props) => {
    const {
        id, 
        isDone: initialState, 
        parent
    } = item
    
    const {
        isEditable = false,
        isTitle = false
    } = config

    const [ isDone, setIsDone ] = useState(initialState)

    const [ showSubtasks, setShowSubtasks ] = useState(false)
    
    const { store, actions } = useTasksContext()

    const handleClickOnRecord = () => { 
        if (!isProject) return

        if (parent && parent.selectedSubTaskId !== id) {
            taskStore.selectTask(item)
            actions.triggerCascadingUpdate() 
        }

        store.showSidebar && actions.setShowSidebar(false)
    }

    const handleMouseDownOnCheckbox = (e: any) => {
        if (e.button === 0) { // left click only
            setIsDone((prevState) => item.isDone = !prevState)
        }
    }

    const handleMouseUpOnCheckbox = (e: any) => {
        if (e.button === 0) { // left click only
            actions.triggerCascadingUpdate()
        }
    }

    const isSelected = parent && id === parent.selectedSubTaskId && !isTitle

    const hasSubtasks = !!item.tasks.length

    const isProject = !!!item.parent?.parent

    const recordClassName = [
        'record', 
        isSelected ? 'record-selected' : '',
        !isEditable ? 'read-only' : '',
        isTitle ? 'title' : '',
        isDone ? 'item-done' : ''
    ].join(' ')

    const hiddenBtnClassName = IS_MOBILE 
        ? isSelected ? '' : ' mobile-hidden-btn'
        : ' hidden-btn' 

    const openSubtasks = () => setShowSubtasks(true)
    const closeSubtasks = () => setShowSubtasks(false)

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
                        showSubtasks={() => setShowSubtasks(true)}
                        classes={[ hiddenBtnClassName ]}
                        isProject={isProject}
                    /> 
                </div>
            </div>
            <SubTaskList task={item} isDisplayed={showSubtasks} />
        </>
    )
}

export default memo(Record)
