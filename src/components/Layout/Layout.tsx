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
import Loading from '../Statuses/Loading'
import Syncer from '../../utils/Syncer'

const Layout = () => {
    const { store, actions } = useTasksContext()

    const { 
        showSidebar = false, 
        loading
    } = store

    const [ isSettingsOpened, setIsSettingsOpened ] = useState(false)

    const syncer = new Syncer(actions)

    useEffect(() => {
        initializeSynchronization()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const initializeSynchronization = () => {
        syncer.onLoad()
        window.addEventListener('unload', () => syncer.saveToLS())
        window.addEventListener('blur', () => syncer.saveToLS())
        setInterval(() => syncer.onDemand(), 300000) // every 5 min
    }

    const toggleSettings = () =>
        setIsSettingsOpened(!isSettingsOpened)

    const openLeftPanel = () => {
        if (!showSidebar) {
            actions.setShowSidebar(true)
            enableBodyScrolling(false)
        }
    }

    const closeLeftPanel = () => {
        if (showSidebar) {
            actions.setShowSidebar(false)
            enableBodyScrolling(true)
        }
    }

    return (
        <div className="main-container">   
            <Modal />
            {loading && <Loading />}
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
                <Fog isDisplayed={showSidebar} />
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
                        <button onClick={() => syncer.onDemand()}>SYNC</button>
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