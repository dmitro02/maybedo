import { useEffect, useState } from 'react'
import './MainContainer.scss'
import Loading from '../Statuses/Loading'
import syncer from '../../classes/Syncer'
import Sidebar from '../Sidebar/Sidebar'
import Content from './Content'
import { usePropertyWithState } from '../../classes/Store'
import * as lsUtils from "../../utils/localStorageUtils"

const MainContainer = () => {
    const [ isSettingsOpened, setIsSettingsOpened ] = useState(false)
    const [ isSidebarOpened, setIsSidebarOpened ] = useState(false)

    const [ selectedProjectId ] = usePropertyWithState('selectedProjectId')

    useEffect(() => {
        // syncer.init()
        // syncer.sync()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        lsUtils.setSelectedProjectId(selectedProjectId)
    })

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
