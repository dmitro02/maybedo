import React, { useState, useRef, useEffect, memo } from 'react'
import './Record.scss'
import { ITask } from '../../types'
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
import { isTopLevelItem } from '../../utils/pathUtils'

export type RecordConfig = {
    useCheckMark?: boolean
    useDeleteBtn?: boolean
    useDragBtn?: boolean
    useEditBtn?: boolean
    isEditable?: boolean
    isTitle?: boolean
}

type Props = { 
    item: ITask, 
    config: RecordConfig, 
    parent: ITask
}

const Record = ({ item, config, parent }: Props) => {
    const { isDone: initialState, text, path } = item
    
    const {
        useCheckMark = false,
        useDeleteBtn = false,
        useDragBtn = false,
        useEditBtn = false,
        isEditable = false,
        isTitle = false
    } = config

    const [ isDone, setIsDone ] = useState(initialState)
    const [ caretPos, setCaretPos ] = useState<number|undefined>(undefined)

    const [ store, dispatch ] = useTasksContext()

    const recordContentRef = useRef<HTMLElement>(null)

    useEffect(() => {
        document.activeElement === recordContentRef.current && setCaret()   
    })

    useEffect(() => {
        if (isJustAdded) {
            setContentEditable(true)
            setFocus()
            setCaret()
            selectRecord(item)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [path, store.addedItemId])

    const updateRecord = (item: ITask) => dispatch(updateTaskAction(item))

    const deleteRecord = (item: ITask) => {    
        if (isTopLevelItem(item)) {
            if (parent.tasks.length === 1) {
                parent.selectedTaskPath = undefined
            } else if (item === parent.tasks[0]) {
                parent.selectedTaskPath = parent.tasks[1].path
            } else {
                parent.selectedTaskPath = parent.tasks[0].path
            }
            dispatch(updateTaskAction(parent))
        }
        dispatch(deleteTaskAction(item))
    }

    const selectRecord = (item: ITask) => {
        if (parent.selectedTaskPath === item.path) return
        parent.selectedTaskPath = item.path
        dispatch(updateTaskAction(parent))
    }

    const handleMouseDownOnCheckbox = () => {
        setIsDone((prevState) => item.isDone = !prevState)
    }

    const handleMouseUpOnCheckbox = () => updateRecord(item)

    const handleInput = debounceInput((text: string) => {
        item.text = text
        setCaretPos(getCaretPosition(recordContentRef.current || undefined))
        updateRecord(item)
    })

    const handleDelete = (e: any) => {
        e.stopPropagation() // prevent item selection ob click
        deleteRecord(item)
    }

    const setContentEditable = (flag: boolean) => {
        const el = recordContentRef.current
        el?.setAttribute('contenteditable', '' + flag)
        setCaret()
    }

    const handleBlur = () => {
        (useEditBtn || !isEditable) && setContentEditable(false)
    }

    const setCaret = () =>
        setCaretPosition(recordContentRef.current || undefined, caretPos)

    const setFocus = () => recordContentRef.current?.focus()

    const isJustAdded = store.addedItemPath === path && !isTitle

    const isSelected = path === parent.selectedTaskPath && !isTitle

    const className = `record${isSelected ? ' record-selected' : ''}\
        ${!isEditable ? ' read-only' : ''}${isTitle ? ' title' : ''}`

    return (
        <div 
            className={className}
            id={path} 
            onClick={() => {
                setCaretPos(getCaretPosition(recordContentRef.current || undefined))
                !isTitle && selectRecord(item)
            }}
        >
            {useDragBtn && <i className="material-icons drag-mark">drag_handle</i>}
            {useCheckMark && <span
                onMouseDown={handleMouseDownOnCheckbox} 
                onMouseUp={handleMouseUpOnCheckbox}
            >
                {!isDone && <i className="material-icons check-mark">check_box_outline_blank</i>}
                {isDone && <i className="material-icons check-mark">check_box</i>}
            </span>}
            <span 
                ref={recordContentRef}
                className={'item-content' + (isDone ? ' item-done' : '')} 
                contentEditable={isEditable && !useEditBtn}
                suppressContentEditableWarning={true}
                onInput={handleInput}
                onBlur={handleBlur}
            >
                {text}
            </span>
            {useEditBtn && 
                <i className="material-icons edit-btn" onClick={() => setContentEditable(true)}>edit</i>}
            {useDeleteBtn && 
                <i className="material-icons delete-btn" onClick={handleDelete}>clear</i>}
        </div>
    )
}

export default memo(Record)
