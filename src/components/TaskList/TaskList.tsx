import React from 'react'
import './TaskList.scss'
import TaskRecord from '../TaskRecord/TaskRecord'
import { Task } from '../../types'

interface Props { tasks: Task[] }

const TaskList = ({ tasks }: Props) => {
    return (
        <div className="task-list">
            {tasks.map(
                task => <TaskRecord key={task.id} task={task}/>
            )}
        </div>
    )
}

export default TaskList