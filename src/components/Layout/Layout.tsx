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
import Divider from '../Divider/Divider'
import Fog from '../Fog/Fog'

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

    const handleProjectClick = (e: any) => {
        const classes = e.target.classList
        const parentClasses = e.target.parentElement?.classList

        if (classes.contains('item-content') 
            && !parentClasses.contains('title')
            && !parentClasses.contains('add-record')) 
        {
            closeLeftPanel()
        }
    }

    return (
        <div className="main-container">   
            <TasksContextProvider>
                <Modal />
                <div 
                    className={`left-panel${showLeftPanel ? ' panel-opened' : ''}`}
                    onClick={handleProjectClick}
                >
                    <Fog isDisplayed={isSettingsOpened}/>
                    <div className="top-panel">
                        <div className="row-btns">
                            <ArrowBackButton 
                                action={closeLeftPanel} 
                                classNames={['close-menu-btn']} 
                                title="hide projects list"
                            />
                            <EmptyButton />
                        </div>
                    </div>
                    <Divider />
                    <ProjectList />
                </div>
                <div className="right-panel" onClick={closeLeftPanel}>
                    <Fog isDisplayed={showLeftPanel}/>
                    <Banner />
                    <div className="top-panel">
                        {!isSettingsOpened &&
                            <div className="row-btns">
                                <EmptyButton />
                                <MenuButton 
                                    action={openLeftPanel} 
                                    classNames={['open-menu-btn']}
                                    title="open projects list"
                                />
                            </div>
                        }
                        <div className="row-btns">
                            {isSettingsOpened 
                                ? <ArrowBackButton action={toggleSettings} title="close settings"/>
                                : <SettingsButton action={toggleSettings} />
                            }
                            <EmptyButton />
                        </div>
                    </div>
                    <Divider />
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