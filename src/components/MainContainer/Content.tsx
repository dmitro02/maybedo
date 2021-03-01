import Banner from '../Banner/Banner'
import { 
    ArrowBackButton, 
    MenuButton, 
    SettingsButton 
} from '../Buttons/Buttons'
import Fog from '../Fog/Fog'
import NoProjects from '../NoProjects/NoProjects'
import TaskList from '../RecordList/TaskList'
import Settings from '../Settings/Settings'
import SyncStatus from '../Statuses/SyncStatus'
import taskStore from '../../utils/Store'

type Props = {
    isSidebarOpened: boolean,
    isSettingsOpened: boolean,
    openSidebar: () => void,
    toggleSettings: () => void
}

const Content = (props: Props) => {
    const { 
        isSettingsOpened, 
        isSidebarOpened, 
        openSidebar,
        toggleSettings
    } = props

    const { taskList } = taskStore

    const hasData = !!taskList.tasks.length

    return (
        <div className="right-panel">
            <Fog isDisplayed={isSidebarOpened} />
            <Banner />
            <div className="top-panel">
                {!isSettingsOpened &&
                    <div className="row-btns">
                        <MenuButton 
                            action={openSidebar} 
                            classNames={['open-menu-btn']}
                            title="open projects list"
                        />
                    </div>
                }
                <div className="row-btns">
                    <SyncStatus />
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
            {!hasData && !isSettingsOpened && <NoProjects />} 
        </div>
    )
}

export default Content
