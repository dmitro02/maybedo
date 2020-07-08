import React from 'react'
import './Tasks.scss'
import TaskList from '../TaskList/TaskList'
import { useTasksContext } from '../../contexts/TasksContext'

const Tasks = () => {
    const [ allTasks ] = useTasksContext()

    return (
        <div className="tasks-box">
            <TaskList tasks={allTasks.activeTasks} />
            <div className="divider" />
            <TaskList tasks={allTasks.completedTasks} />
        </div>
    )
}

export default Tasks