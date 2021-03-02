import { useEffect, useState } from 'react'
import './MainContainer.scss'
import Loading from '../Statuses/Loading'
import Syncer from '../../utils/Syncer'
import Sidebar from '../Sidebar/Sidebar'
import Content from './Content'
import { useSubscribeWithForceUpdate } from '../../utils/Store'

const MainContainer = () => {
    const [ isSettingsOpened, setIsSettingsOpened ] = useState(false)

    const [ isSidebarOpened, setIsSidebarOpened ] = useState(false)

    useEffect(() => {
        Syncer.getInstance().initSync()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useSubscribeWithForceUpdate('reload')

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
            />
            <Content 
                isSettingsOpened={isSettingsOpened}
                isSidebarOpened={isSidebarOpened}
                toggleSettings={toggleSettings}
                openSidebar={openSidebar}
            />
        </div>
    )
}

export default MainContainer
