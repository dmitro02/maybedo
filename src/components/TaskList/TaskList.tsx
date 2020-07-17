import React from 'react'
import './TaskList.scss'
import TaskRecord from '../TaskRecord/TaskRecord'
import AddTAsk from '../AddTask/AddTask'
import { ITask } from '../../types'

interface IProps { tasks: ITask[], isActive?: boolean }

const TaskList = ({ tasks, isActive }: IProps) => {
    return (
        <div className="task-list">
            {tasks.map(
                task => <TaskRecord key={task.id} task={task} />
            )}
            {isActive && <AddTAsk />
            } 
        </div>
    )
}

export default TaskList