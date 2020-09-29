import React, { useState, useRef, useEffect, memo } from 'react'
import './Record.scss'
import { Task } from '../../types'
import { useTasksContext } from '../../contexts/TasksContext'
import { 
    debounceInput, 
    getCaretPosition,
    setCaretPosition
} from '../../utils/textInputUtils'
import {
    updateTaskAction,
    deleteTaskAction
} from '../../contexts/actionCreators'
import { isProjectLevelItem, isTaskLevelItem } from '../../utils/pathUtils'
import SubTaskList from '../SubTaskList/SubTaskList'

export type RecordConfig = {
    useCheckMark?: boolean
    useDeleteBtn?: boolean
    useDragBtn?: boolean
    useExpandBtn?: boolean
    useAddSubtasksBtn?: boolean
    isEditable?: boolean
    isTitle?: boolean
}

type Props = { 
    item: Task, 
    config: RecordConfig, 
    parent: Task
}

const Record = ({ item, config, parent }: Props) => {
    const { isDone: initialState, text, path } = item
    
    const {
        useCheckMark = false,
        useDeleteBtn = false,
        useDragBtn = false,
        useAddSubtasksBtn = true,
        isEditable = false,
        isTitle = false
    } = config

    const [ isDone, setIsDone ] = useState(initialState)
    const [ 
        stateCaretPosition, 
        setStateCaretPosition
    ] = useState<number|undefined>(undefined)
    const [ showSubtasks, setShowSubtasks ] = useState(false)
    const [ showDeleteConfirmation, setShowDeleteConfirmation ] = useState(false)

    const [ store, dispatch ] = useTasksContext()

    const recordContentRef = useRef<HTMLElement>(null)

    useEffect(() => {
        document.activeElement === recordContentRef.current && loadCaretPositionFromState()  
    })

    useEffect(() => {
        if (isJustAdded) {
            setContentEditable(true)
            setFocus()
            loadCaretPositionFromState()
            selectRecord(item)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [path, store.addedItemId])

    const updateRecord = (item: Task) => dispatch(updateTaskAction(item))

    const deleteRecord = (item: Task) => {    
        if (isProjectLevelItem(item)) {
            if (parent.tasks.length === 1) {
                parent.selectedSubTaskPath = undefined
            } else if (item === parent.tasks[0]) {
                parent.selectedSubTaskPath = parent.tasks[1].path
            } else {
                parent.selectedSubTaskPath = parent.tasks[0].path
            }
            dispatch(updateTaskAction(parent))
        }
        dispatch(deleteTaskAction(item))
    }

    const selectRecord = (item: Task) => {
        if (parent.selectedSubTaskPath === item.path) return
        parent.selectedSubTaskPath = item.path
        dispatch(updateTaskAction(parent))
    }

    const handleMouseDownOnCheckbox = (e: any) => {
        if (e.button === 0) { // left click only
            setIsDone((prevState) => item.isDone = !prevState)
        }
    }

    const handleMouseUpOnCheckbox = (e: any) => {
        if (e.button === 0) { // left click only
            updateRecord(item)
        }
    }
        
    const handleInput = debounceInput((text: string) => {
        item.text = text
        saveCaretPositionToState()
        updateRecord(item)
    })

    const handleDelete = (e: any) => {
        e.stopPropagation() // prevent item selection ob click
        setShowDeleteConfirmation(true)
    }

    const setContentEditable = (flag: boolean) => {
        const el = recordContentRef.current
        el?.setAttribute('contenteditable', '' + flag)
        loadCaretPositionFromState()
    }

    const saveCaretPositionToState = () => 
        setStateCaretPosition(getCaretPosition(recordContentRef.current || undefined))

    const loadCaretPositionFromState = () => 
        setCaretPosition(recordContentRef.current || undefined, stateCaretPosition)

    const handleBlur = () => !isEditable && setContentEditable(false)

    const setFocus = () => recordContentRef.current?.focus()

    const isJustAdded = store.addedItemPath === path && !isTitle

    const isSelected = path === parent.selectedSubTaskPath && !isTitle

    const hasSubtasks = !!item.tasks.length

    const recordClassName = `record${isSelected ? ' record-selected' : ''}\
        ${!isEditable ? ' read-only' : ''}${isTitle ? ' title' : ''}`

    const getSubtasksBtn = () => {
        if (!useAddSubtasksBtn || !isTaskLevelItem(item)) return null
        let btnClassName = 'material-icons commom-btn'
        let btnType
        if (hasSubtasks) {
            btnType = showSubtasks ? 'expand_less' : 'expand_more'
        } else if (!(parent.isDone || isDone)) {
            btnType = showSubtasks ? 'expand_less' : 'add'
            btnClassName += ' hidden-btn' 
        } else {
            return null
        }
        return <i className={btnClassName} onClick={() => {setShowSubtasks(!showSubtasks)}}>
                    {btnType}
                </i>
    }

    return (
        <>
            <div 
                className={recordClassName}
                id={path} 
                onClick={() => {
                    saveCaretPositionToState()
                    !isTitle && selectRecord(item)
                }}
            >
                {useDragBtn && <i className="material-icons hidden-btn drag-mark commom-btn">drag_handle</i>}
                {useCheckMark && <span
                    onMouseDown={handleMouseDownOnCheckbox} 
                    onMouseUp={handleMouseUpOnCheckbox}
                >
                    {!isDone && <i className="material-icons commom-btn">check_box_outline_blank</i>}
                    {isDone && <i className="material-icons commom-btn">check_box</i>}
                </span>}
                <span 
                    ref={recordContentRef}
                    className={'item-content' + (isDone ? ' item-done' : '')} 
                    contentEditable={isEditable}
                    suppressContentEditableWarning={true}
                    onInput={handleInput}
                    onBlur={handleBlur}
                >
                    {text}
                </span>
                {getSubtasksBtn()}  
                {useDeleteBtn && 
                    <>
                        <i className="material-icons hidden-btn commom-btn" onClick={handleDelete}>clear</i>
                        {showDeleteConfirmation && 
                            <div className="confirm-delete">
                                <button onClick={() => deleteRecord(item)}>Yes</button> 
                                <button onClick={() => setShowDeleteConfirmation(false)}>No</button>   
                            </div>
                        }  
                    </> 
                }
    
            </div>
            <SubTaskList task={item} isDisplayed={showSubtasks} />
        </>
    )

    
}

export default memo(Record)
