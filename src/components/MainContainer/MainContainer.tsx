import { useEffect, useState } from 'react'
import './MainContainer.scss'
import Loading from '../Statuses/Loading'
import syncer from '../../classes/Syncer'
import Sidebar from '../Sidebar/Sidebar'
import Content from './Content'
import { Events, useSubscribe } from '../../classes/Notifier'
import DATA from '../../flat-data'
import { getRoot, updateTask } from '../../utils/taskService'

// lsUtils.init()
// lsUtils.populateData(DATA)

const MainContainer = () => {
    const [ isSettingsOpened, setIsSettingsOpened ] = useState(false)

    const [ isSidebarOpened, setIsSidebarOpened ] = useState(false)

    const [ selectedProjectId, setSelectedProjectId ] = useState('')

    useSubscribe(Events.SelectProject, (data) => {
        selectProject(data.id)
    })

    useEffect(() => {
        // syncer.initSync()
        selectProject()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const selectProject = (projectId?: string) => {
        const root = getRoot()
        if (!root || !root.tasks) return        
        const id = projectId || root.selectedSubTaskId || root.tasks[0] || ''
        if (id !== root.selectedSubTaskId) {
            root.selectedSubTaskId = id
            updateTask(root)
        }
        setSelectedProjectId(id)
    }

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
