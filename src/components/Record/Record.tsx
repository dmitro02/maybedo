import React, { useState, useRef, useEffect } from 'react'
import './Record.scss'
import { ITask } from '../../types'
import { useTasksContext } from '../../contexts/TasksContext'
import {
    changeTaskAction,
    deleteTaskAction,
    setAddedTaskId
} from '../../contexts/actionCreators'
import { 
    debounceInput, 
    moveCaretToEndAndFocus 
} from '../../utils'

export interface IRecordConfig {
    useCheckMark: boolean
    useDeleteBtn: boolean
    useDragBtn: boolean
    useEditBtn: boolean
    isEditable: boolean
}

interface IProps { task: ITask, config: IRecordConfig }

const Record = ({ task, config }: IProps) => {
    const { isDone: initialState, text: data, id } = task
    
    const {
        useCheckMark,
        useDeleteBtn,
        useDragBtn,
        useEditBtn,
        isEditable
    } = config

    const [ isDone, setIsDone ] = useState(initialState)

    const [ store, dispatch ] = useTasksContext()

    const recordContentRef = useRef<HTMLElement>(null)

    useEffect(() => {
        if (store.addedItemId === id) {
            setContentEditable(true)
            setCaret()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, store.addedItemId])

    const handleMouseDownOnCheckbox = () => {
        setIsDone((prevState) => task.isDone = !prevState)
    }

    const handleMouseUpOnCheckbox = () => dispatch(changeTaskAction(task))

    const handleInput = debounceInput((text: string) => {
        task.text = text
        dispatch(changeTaskAction(task))
        setCaret()
    })

    const deleteTask = () => dispatch(deleteTaskAction(task))

    const setContentEditable = (flag: boolean) => {
        if (!useEditBtn) return
        const el = recordContentRef.current
        if (!el) return
        el.setAttribute('contenteditable', '' + flag)
        setCaret()
    }

    const handleBlur = () => {
        setContentEditable(false)
        dispatch(setAddedTaskId)
    }

    const setCaret = () => {
        const el = recordContentRef.current
        el && moveCaretToEndAndFocus(el)
    }

    return (
        <div className="record">
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
                className={'task-content' + (isDone ? ' task-done' : '')} 
                contentEditable={isEditable && !useEditBtn}
                suppressContentEditableWarning={true}
                onInput={handleInput}
                onBlur={handleBlur}
            >
                {data}
            </span>
            {useEditBtn && 
                <i className="material-icons edit-btn" onClick={() => setContentEditable(true)}>edit</i>}
            {useDeleteBtn && 
                <i className="material-icons delete-btn" onClick={deleteTask}>clear</i>}
        </div>
    )
}

export default Record