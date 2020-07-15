import React from 'react'
import './TaskList.scss'
import TaskRecord from '../TaskRecord/TaskRecord'
import { ITask } from '../../types'

interface IProps { tasks: ITask[], isActive?: boolean }

const TaskList = ({ tasks, isActive }: IProps) => {
    return (
        <div className="task-list">
            {tasks.map(
                task => <TaskRecord key={task.id} task={task} />
            )}
            {isActive &&
                <div className="add-task-record">
                    <i className="material-icons add-mark">add</i>
                    <span>new task</span>
                </div>
            } 
        </div>
    )
}

export default TaskList