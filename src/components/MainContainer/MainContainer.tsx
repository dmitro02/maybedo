import { useEffect, useState } from 'react'
import './MainContainer.scss'
import Loading from '../Statuses/Loading'
import syncer from '../../classes/Syncer'
import Sidebar from '../Sidebar/Sidebar'
import Content from './Content'
import { Events, useSubscribe } from '../../classes/Notifier'
import { getProjectsList, initRoot } from '../../utils/taskService'
import metadata from '../../classes/Metadata'
import * as lsUtils from "../../utils/localStorageUtils"

metadata.init()
initRoot()

// lsUtils.populateData(DATA)

const MainContainer = () => {
    const [ isSettingsOpened, setIsSettingsOpened ] = useState(false)

    const [ isSidebarOpened, setIsSidebarOpened ] = useState(false)

    const [ selectedProjectId, setSelectedProjectId ] = useState('')

    const selectProject = (id: string) => {
        setSelectedProjectId(id)
        lsUtils.setSelectedProjectId(id)
    }

    const selectProjectOnLoad = () => {
        let id = lsUtils.getSelectedProjectId()
                || getProjectsList()[0]?.id 
                || ''
        selectProject(id)
    }

    useSubscribe(Events.SelectProject, selectProject)

    useEffect(() => {
        // syncer.init()
        // syncer.sync()
        selectProjectOnLoad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const toggleSettings = () =>
        setIsSettingsOpened(!isSettingsOpened)

    const openSidebar = () => {
        setIsSidebarOpened(true)        
        !window.iAmRunningOnMobile && window.addEventListener('resize', closeSidebar)
    }

    const closeSidebar = () => {
        setIsSidebarOpened(false)
        window.removeEventListener('resize', closeSidebar)
    }

    return (
        <div className={`main-container${isSidebarOpened ? ' sidebar-opened' : ''}`}>   
            <Loading />
            <Sidebar 
                isOpened={isSidebarOpened} 
                close={closeSidebar} 
                isSettingsOpened={isSettingsOpened}
                projectId={selectedProjectId}
            />
            <Content 
                isSettingsOpened={isSettingsOpened}
                isSidebarOpened={isSidebarOpened}
                toggleSettings={toggleSettings}
                openSidebar={openSidebar}
                projectId={selectedProjectId}
            />
        </div>
    )
}

export default MainContainer
