import React from 'react'
import './MainContainer.scss'
import { TasksContextProvider } from '../../contexts/TasksContext'
import Projects from '../Projects/Projects'
import Tasks from '../Tasks/Tasks'

const MainContainer = () => {

    return (
        <div className="main-container">
            <TasksContextProvider>
                <Projects />
                <Tasks />
            </TasksContextProvider>
        </div>
    )
}

export default MainContainer