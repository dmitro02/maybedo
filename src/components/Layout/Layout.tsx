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
    EmptyButton, 
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
                    <div className="top-panel">
                        <div className="row-btns">
                            <ArrowBackButton action={closeLeftPanel} classNames={['close-menu-btn']}/>
                            <EmptyButton />
                        </div>
                    </div>
                    <ProjectList />
                </div>
                <div 
                    className="right-panel"
                    onClick={closeLeftPanel}
                >
                    <Banner />
                    <div className="top-panel">
                        <div className="row-btns">
                            <EmptyButton />
                            <MenuButton action={openLeftPanel} classNames={['open-menu-btn']} />
                        </div>
                        <div className="row-btns">
                            <SettingsButton action={toggleSettings} />
                            <EmptyButton />
                        </div>
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