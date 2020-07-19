import React from 'react'
import './Tasks.scss'
import TaskList from '../TaskList/TaskList'
import { useTasksContext } from '../../contexts/TasksContext'

const Tasks = () => {
    const [ allTasks ] = useTasksContext()

    const { activeTasks, completedTasks } = allTasks

    return (
        <div className="tasks-box">
            <TaskList tasks={activeTasks} isActive={true} />
            <div className={'divider ' + (!completedTasks.length && 'hidden')} />
            <TaskList tasks={completedTasks} />
        </div>
    )
}

export default Tasks