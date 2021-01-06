import React, { useEffect, useState } from 'react'
import './Layout.scss'
import { useTasksContext } from '../../contexts/TasksContext'
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
import { setShowSidebar } from '../../contexts/actionCreators'
import { saveToLocalStorage } from '../../utils/persistDataUtils'
import Spinner from '../Spinner/Spinner'

const Layout = () => {
    const [ store, dispatch ] = useTasksContext()

    const { showSidebar, rootProject } = store

    const [ isSettingsOpened, setIsSettingsOpened ] = useState(false)

    useEffect(() => {
        window.addEventListener('unload', () => saveToLocalStorage(rootProject))
        window.addEventListener('blur', () => saveToLocalStorage(rootProject))
    })

    const toggleSettings = () =>
        setIsSettingsOpened(!isSettingsOpened)

    const openLeftPanel = () => {
        if (!showSidebar) {
            dispatch(setShowSidebar(true))
            enableBodyScrolling(false)
        }
    }

    const closeLeftPanel = () => {
        if (showSidebar) {
            dispatch(setShowSidebar(false))
            enableBodyScrolling(true)
        }
    }

    return (
        <div className="main-container">   
            <Modal />
            <Spinner />
            <div className={`left-panel${showSidebar ? ' panel-opened' : ''}`}>
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
                <Fog isDisplayed={showSidebar}/>
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
        </div>
    )
}

const enableBodyScrolling = (isEnabled: boolean) =>
    document.body.style.overflow = isEnabled? 'auto' : 'hidden'

export default Layout