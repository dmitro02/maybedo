import React, { useState, useRef, useEffect } from 'react'
import './Record.scss'
import { ITask } from '../../types'
import { 
    useTasksContext, 
    setTaskAction,
    deleteTaskAction
} from '../../contexts/TasksContext'
import { debounceInput } from '../../utils'

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

    const [ context, dispatch ] = useTasksContext()

    const thisTaskContent = useRef<HTMLElement>(null)

    useEffect(() => {
        if (context.justAddedTaskId === id) {
            const el = thisTaskContent.current
            el && moveCursorToEndAndFocus(el)
        }
    }, [context.justAddedTaskId, id])

    const handleMouseDownOnCheckbox = () => {
        setIsDone((prevState) => task.isDone = !prevState)
    }

    const handleMouseUpOnCheckbox = () => dispatch(setTaskAction(task))

    const handleInput = debounceInput((text: string) => task.text = text)

    const deleteTask = () => dispatch(deleteTaskAction(task))

    const setContentEditable = (flag: boolean) => {
        if (!useEditBtn) return
        const el = thisTaskContent.current
        if (!el) return
        el.setAttribute('contenteditable', '' + flag)
        el.focus()
        moveCursorToEndAndFocus(el)
    }

    return (
        <div className="record" id={'task' + task.id}>
            {useDragBtn && <i className="material-icons drag-mark">drag_handle</i>}
            {useCheckMark && <span
                onMouseDown={handleMouseDownOnCheckbox} 
                onMouseUp={handleMouseUpOnCheckbox}
            >
                {!isDone && <i className="material-icons check-mark">check_box_outline_blank</i>}
                {isDone && <i className="material-icons check-mark">check_box</i>}
            </span>}
            <span 
                ref={thisTaskContent}
                className={'task-content' + (isDone ? ' task-done' : '')} 
                contentEditable={isEditable && !useEditBtn}
                suppressContentEditableWarning={true}
                onInput={handleInput}
                onBlur={() => setContentEditable(false)}
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

const moveCursorToEndAndFocus = (el: HTMLElement) => {
    const range = document.createRange()
    const selection = window.getSelection()
    const elContentNode = el.childNodes[0]
    if (!elContentNode || !elContentNode.textContent) return
    range.setStart(elContentNode, elContentNode.textContent.length)
    range.collapse()
    selection?.removeAllRanges()
    selection?.addRange(range)
    el.focus()
}

export default Record