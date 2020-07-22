import React from 'react'
import './Tasks.scss'
import TaskList from '../TaskList/TaskList'
import { useTasksContext } from '../../contexts/TasksContext'
import Header from '../Header/Header'
import Divider from '../Divider/Divider'

const Tasks = () => {
    const [ contex ] = useTasksContext()

    const { activeTasks, completedTasks } = contex

    return (
        <div className="tasks-box">
            <Header />
            <Divider />
            <TaskList tasks={activeTasks} isActive={true} />
            <Divider isHidden={!completedTasks.length} />
            <TaskList tasks={completedTasks} />
        </div>
    )
}

export default Tasks