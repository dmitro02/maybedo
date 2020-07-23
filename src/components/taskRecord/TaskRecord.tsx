import React, { useState, useRef, useEffect } from 'react'
import './TaskRecord.scss'
import { ITask } from '../../types'
import { 
    useTasksContext, 
    setTaskAction,
    deleteTaskAction
} from '../../contexts/TasksContext'

interface IProps { task: ITask }

const TaskRecord = ({ task }: IProps) => {
    const { isDone: initialState, data, id } = task

    const [ isDone, setIsDone ] = useState(initialState)

    const [ context, dispatch ] = useTasksContext()

    const thisTaskContent = useRef(null)

    useEffect(() => {
        if (context.justAddedTaskId === id) {
            const el = thisTaskContent.current
            el && moveCursorToEndAndFocus(el)
        }
    }, [context.justAddedTaskId, id])

    const handleMouseDownOnCheckbox = () => {
        setIsDone((prevState) => task.isDone = !prevState)
    }

    const handleMouseUpOnCheckbox = () => {     
        dispatch(setTaskAction(task))
    }

    const debouncedInputHandler = () => {
        let timeout: any
        return (e: any) => {
            const text = e.target.textContent
            clearTimeout(timeout)
            timeout = setTimeout(() => task.data = text, 700)
        }
    }

    const deleteTask = () => {
        dispatch(deleteTaskAction(task))
    }

    return (
        <div className="task-record" id={'task' + task.id}>
            <i className="material-icons drag-mark">drag_handle</i>
            <span
                onMouseDown={handleMouseDownOnCheckbox} 
                onMouseUp={handleMouseUpOnCheckbox}
            >
                {!isDone && <i className="material-icons check-mark">check_box_outline_blank</i>}
                {isDone && <i className="material-icons check-mark">check_box</i>}
            </span>
            <span 
                ref={thisTaskContent}
                className={'task-content' + (isDone ? ' task-done' : '')} 
                contentEditable="true"
                suppressContentEditableWarning={true}
                onInput={debouncedInputHandler()}
            >
                {data}
            </span>
            <i className="material-icons delete-btn" onClick={deleteTask}>clear</i>
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

export default TaskRecord