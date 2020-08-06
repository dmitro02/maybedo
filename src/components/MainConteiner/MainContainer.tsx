import React from 'react'
import './MainContainer.scss'
import { TasksContextProvider } from '../../contexts/TasksContext'
import ProjectList from '../ProjectList/ProjectList'
import TaskList from '../TaskList/TaskList'

const MainContainer = () => {

    return (
        <div className="main-container">
            <TasksContextProvider>
                <ProjectList />
                <TaskList />
            </TasksContextProvider>
        </div>
    )
}

export default MainContainer