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
        if (!showLeftPanel) {
            setShowLeftPanel(true)
            enableBodyScrolling(false)
        }
    }

    const closeLeftPanel = () => {
        if (showLeftPanel) {
            setShowLeftPanel(false)
            enableBodyScrolling(true)
        }
    }

    return (
        <div className="main-container">   
            <TasksContextProvider>
                <Modal />
                <div className={`left-panel ${showLeftPanel ? ' panel-opened' : ''}`}>
                    <i 
                        className="material-icons commom-btn close-menu-btn"
                        onClick={closeLeftPanel}
                    >arrow_back_ios</i>
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
                    <i 
                        className="material-icons commom-btn open-menu-btn"
                        onClick={openLeftPanel}
                    >menu</i>
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

const enableBodyScrolling = (isEnabled: boolean) => {
    document.body.style.overflow = isEnabled? 'auto' : 'hidden'
}

export default Layout