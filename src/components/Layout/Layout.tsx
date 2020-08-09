import React from 'react'
import './Layout.scss'
import { TasksContextProvider } from '../../contexts/TasksContext'
import ProjectList from '../ProjectList/ProjectList'
import TaskList from '../TaskList/TaskList'

const Layout = () => {

    return (
        <div className="main-container">
            <TasksContextProvider>
                <div className="left-panel card">
                    <ProjectList />
                </div>
                <div className="right-panel card">
                    <TaskList />
                </div>
            </TasksContextProvider>
        </div>
    )
}

export default Layout