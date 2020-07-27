import React from 'react'
import './MainContainer.scss'
import { TasksContextProvider } from '../../contexts/TasksContext'
import SideBar from '../Projects/Projects'
import Tasks from '../Tasks/Tasks'

interface IProps {}

const MainContainer = () => {

    return (
        <div className="main-container">
            <TasksContextProvider>
                <SideBar />
                <Tasks />
            </TasksContextProvider>
        </div>
    )
}

export default MainContainer