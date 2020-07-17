import React, { useState } from 'react'
import './TaskRecord.scss'
import { ITask } from '../../types'
import { 
    useTasksContext, 
    moveTaskAction 
} from '../../contexts/TasksContext'

interface IProps { task: ITask }

const TaskRecord = ({ task }: IProps) => {
    const { isDone: initialState, data } = task

    const [ isDone, setIsDone ] = useState(initialState)

    const [, dispatch ] = useTasksContext()

    const handleMouseDownOnCheckbox = (e: any) => {
        setIsDone((prevState) => task.isDone = !prevState)
    }

    const handleMouseUpOnCheckbox = (e: any) => {     
        dispatch(moveTaskAction(task))
    }

    return (
        <div className="task-record">
            <span
                onMouseDown={handleMouseDownOnCheckbox} 
                onMouseUp={handleMouseUpOnCheckbox}
            >
                {!isDone && <i className="material-icons checkmark">check_box_outline_blank</i>}
                {isDone && <i className="material-icons checkmark">check_box</i>}
            </span>
            <span className={isDone ? 'task-done' : 'task-undone'}>{data}</span>
            <i className="material-icons delete-btn">clear</i>
        </div>
    )
}

export default TaskRecord