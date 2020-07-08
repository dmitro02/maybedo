import React from 'react'
import './TaskList.scss'
import TaskRecord from '../TaskRecord/TaskRecord'
import { ITask } from '../../types'

interface IProps { tasks: ITask[] }

const TaskList = ({ tasks }: IProps) => {
    return (
        <div className="task-list">
            {tasks.map(
                task => <TaskRecord key={task.id} task={task}/>
            )}
        </div>
    )
}

export default TaskList