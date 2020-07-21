import React, { useEffect } from 'react'
import './TaskList.scss'
import TaskRecord from '../TaskRecord/TaskRecord'
import AddTAsk from '../TaskRecord/AddTask'
import { ITask } from '../../types'

interface IProps { tasks: ITask[], isActive?: boolean, editedTaskId?: number }

const TaskList = ({ tasks, isActive, editedTaskId }: IProps) => {
    useEffect(() => {
        const el = document.querySelector<HTMLElement>(`#task${editedTaskId} > .task-content`)
        el && moveCursorToEndAndFocus(el)
    }, [editedTaskId, tasks])

    return (
        <div className="task-list">
            {tasks.map(
                task => <TaskRecord key={task.id} task={task} />
            )}
            {isActive && <AddTAsk />} 
        </div>
    )
}

const moveCursorToEndAndFocus = (el: HTMLElement) => {
    const range = document.createRange()
    const selection = window.getSelection()
    range.setStart(el.childNodes[0], 1)
    range.collapse(true)
    selection?.removeAllRanges()
    selection?.addRange(range)
    el.focus()
}

export default TaskList