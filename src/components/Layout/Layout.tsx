import React, { useState } from 'react'
import './Layout.scss'
import { TasksContextProvider } from '../../contexts/TasksContext'
import ProjectList from '../ProjectList/ProjectList'
import TaskList from '../TaskList/TaskList'
import Divider from '../Divider/Divider'
import Settings from '../Settings/Settings'
import Modal from '../Modal/Modal'
import Banner from '../Banner/Banner'

const Layout = () => {
    const [ isSettingsOpened, setIsSettingsOpened ] = useState(false)
    const [ showLeftPanel, setShowLeftPanel ] = useState(false)

    const toggleSettings = () =>
        setIsSettingsOpened(!isSettingsOpened)

    const openLeftPanel = () => {
        if (!showLeftPanel) setShowLeftPanel(true)
    }

    const closeLeftPanel = () => {
        if (showLeftPanel) setShowLeftPanel(false)
    }

    return (
        <div className="main-container">   
            <TasksContextProvider>
                <Modal />
                <i 
                    className="material-icons menu-btn"
                    onClick={openLeftPanel}
                >menu</i>
                <div className={`left-panel ${showLeftPanel ? ' panel-opened' : ''}`}>
                    <ProjectList />
                    <Divider />
                    <div className="menu">
                        <div className="menu-item" onClick={toggleSettings}>
                            <i className="material-icons-outlined">settings</i>
                            <span>Settings</span>
                        </div>
                    </div>
                </div>
                <div 
                    className="right-panel"
                    onClick={closeLeftPanel}
                >
                    <Banner />
                    <div className="right-content">
                        {isSettingsOpened 
                            ? <Settings backToTaskList={toggleSettings}/>
                            : <TaskList />
                        }
                    </div>
                </div>
            </TasksContextProvider>
        </div>
    )
}

export default Layout