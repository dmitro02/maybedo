import React, { useContext } from 'react'
import './Tasks.scss'
import TaskList from '../TaskList/TaskList'
import { TasksContext } from '../../contexts/TasksContext'

const Tasks = () => {
    const [ allTasks ] = useContext(TasksContext)

    return (
        <div className="tasks-box">
            <TaskList tasks={allTasks.activeTasks} />
            <TaskList tasks={allTasks.completedTasks} />
        </div>
    )
}

export default Tasks