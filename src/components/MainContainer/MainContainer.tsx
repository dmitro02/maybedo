import React, { useEffect, useState } from 'react'
import './MainContainer.scss'
import { useTasksContext } from '../../contexts/TasksContext'
import TaskList from '../RecordList/TaskList'
import Settings from '../Settings/Settings'
import Banner from '../Banner/Banner'
import { 
    ArrowBackButton, 
    MenuButton, 
    SettingsButton 
} from '../Buttons/Buttons'
import Fog from '../Fog/Fog'
import Loading from '../Statuses/Loading'
import Syncer from '../../utils/Syncer'
import SyncStatus from '../Statuses/SyncStatus'
import NoProjects from '../NoProjects/NoProjects'
import taskStore from '../../utils/Store'
import Sidebar from '../Sidebar/Sidebar'

const MainContainer = () => {
    const { 
        store : {
            loading,
            syncStatus
        }, 
        actions 
    } = useTasksContext()

    const { taskList } = taskStore

    const [ isSettingsOpened, setIsSettingsOpened ] = useState(false)

    const hasData = !!taskList.tasks.length

    useEffect(() => {
        Syncer.getInstance(actions).initSync()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const toggleSettings = () =>
        setIsSettingsOpened(!isSettingsOpened)

    return (
        // <div className={`main-container${showSidebar ? ' sidebar-opened' : ''}`}>   
        <div className={`main-container`}>   

            {loading && <Loading />}
            <Sidebar />
            <div className="right-panel">
                {/* <Fog isDisplayed={showSidebar} /> */}
                <Banner />
                <div className="top-panel">
                    {!isSettingsOpened &&
                        <div className="row-btns">
                            <MenuButton 
                                action={() => taskStore.notify('openSidebar')} 
                                classNames={['open-menu-btn']}
                                title="open projects list"
                            />
                        </div>
                    }
                    <div className="row-btns">
                        <SyncStatus status={syncStatus} />
                        {isSettingsOpened 
                            ? <ArrowBackButton action={toggleSettings} title="close settings" />
                            : <SettingsButton action={toggleSettings} />
                        }
                    </div>
                </div>
                <div className="right-content">
                    {isSettingsOpened 
                        ? <Settings backToTaskList={toggleSettings} />
                        : <TaskList />
                    }
                </div>
                {!hasData && !isSettingsOpened && !loading && <NoProjects />} 
            </div>
        </div>
    )
}

export default MainContainer
