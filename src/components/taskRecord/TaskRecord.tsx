import React, { useState } from 'react'
import './TaskRecord.scss'
import { Task } from '../../types'

interface Props { task: Task }

const TaskRecord = ({ task }: Props) => {
    const [isDone, setIsDone] = useState(task.isDone)

    const handleClickOnCheckbox = (e: any) => {
        setIsDone(prevIsDone => !prevIsDone)
    }

    return (
        <div className={'task-record ' + (isDone ? 'task-done' : 'task-undone')}>
            <input 
                type="checkbox" 
                defaultChecked={isDone} 
                onClick={handleClickOnCheckbox}
            />
            <span>{task.data}</span>
        </div>
    )
}

export default TaskRecord