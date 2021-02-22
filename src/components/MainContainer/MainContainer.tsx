import { 
    useEffect, 
    useState, 
    useRef 
} from 'react'
import './MainContainer.scss'
import { useTasksContext } from '../../contexts/TasksContext'
import ProjectList from '../RecordList/ProjectList'
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
import { Task } from '../../types'
import taskStore from '../../utils/taskStore'
import { useOutsideClickDetector } from '../../utils/customHooks'
import NoProjects from '../NoProjects/NoProjects'

const MainContainer = () => {
    const { 
        store : {
            showSidebar = false, 
            loading,
            syncStatus
        }, 
        actions 
    } = useTasksContext()

    const {       
        taskList: rootTask,
        taskList: {
            tasks: projectList
        }
    } = taskStore

    const [ isSettingsOpened, setIsSettingsOpened ] = useState(false)

    const hasData = !!projectList.length

    useEffect(() => {
        Syncer.getInstance(actions).initSync()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const toggleSettings = () =>
        setIsSettingsOpened(!isSettingsOpened)

    const openLeftPanel = () => {
        if (!showSidebar) {
            actions.setShowSidebar(true)
            !window.iAmRunningOnMobile &&
                window.addEventListener('resize', closeLeftPanel)
        }
    }

    const closeLeftPanel = () => {        
        actions.setShowSidebar(false)
        window.removeEventListener('resize', closeLeftPanel)
    }

    const closeLeftPanelIfOpened = () => {
        showSidebar && closeLeftPanel()
    }

    const leftPanelRef = useRef(null)
    useOutsideClickDetector(leftPanelRef, closeLeftPanelIfOpened, showSidebar)

    // select project
    const selectedProject = projectList.length 
        ? projectList.find((task: Task) => task.id === rootTask.selectedSubTaskId) || projectList[0]
        : null
    if (!rootTask.selectedSubTaskId && selectedProject) {
        rootTask.selectedSubTaskId = selectedProject.id
    }

    return (
        <div className={`main-container${showSidebar ? ' sidebar-opened' : ''}`}>   
            {loading && <Loading />}
            <div ref={leftPanelRef} className={`left-panel${showSidebar ? ' panel-opened' : ''}`}>
                <Fog isDisplayed={isSettingsOpened} />
                <div className="top-panel">
                    <div className="row-btns">
                        <ArrowBackButton 
                            action={closeLeftPanelIfOpened} 
                            classNames={['close-menu-btn']} 
                            title="hide projects list"
                        />
                    </div>
                </div>
                <ProjectList rootTask={rootTask}/>
            </div>
            <div className="right-panel" onClick={closeLeftPanelIfOpened}>
                <Fog isDisplayed={showSidebar} />
                <Banner />
                <div className="top-panel">
                    {!isSettingsOpened &&
                        <div className="row-btns">
                            <MenuButton 
                                action={openLeftPanel} 
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
                        : selectedProject && <TaskList rootTask={selectedProject} />
                    }
                </div>
                {!hasData && !isSettingsOpened && !loading && <NoProjects />} 
            </div>
        </div>
    )
}

export default MainContainer
