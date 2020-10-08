import React, { useState } from 'react'
import './Layout.scss'
import { TasksContextProvider } from '../../contexts/TasksContext'
import ProjectList from '../ProjectList/ProjectList'
import TaskList from '../TaskList/TaskList'
import Settings from '../Settings/Settings'
import Modal from '../Modal/Modal'
import Banner from '../Banner/Banner'
import { 
    ArrowBackButton, 
    MenuButton, 
    SettingsButton 
} from '../Buttons/Buttons'

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
                    <ArrowBackButton action={closeLeftPanel} classNames={['close-menu-btn']}/>
                    <ProjectList />
                </div>
                <div 
                    className="right-panel"
                    onClick={closeLeftPanel}
                >
                    <div className="top-panel">
                        <MenuButton action={openLeftPanel} classNames={['open-menu-btn']} />
                        <SettingsButton action={toggleSettings} />
                        <Banner />
                    </div>
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