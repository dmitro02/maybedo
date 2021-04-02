import Banner from '../Banner/Banner'
import MenuButton from '../Buttons/MenuButton'
import { RiSettingsLine } from 'react-icons/ri'
import Fog from '../Fog/Fog'
import NoProjects from '../NoProjects/NoProjects'
import TaskList from '../RecordList/TaskList'
import Settings from '../Settings/Settings'
import SyncStatus from '../Statuses/SyncStatus'
import taskStore from '../../classes/Store'
import { BsBoxArrowLeft } from 'react-icons/bs'

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

    const hasData = !!taskList!.tasks.length

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
                        ? <BsBoxArrowLeft 
                            className="common-btn close settings"
                            onClick={toggleSettings}
                            title="close settings"
                          />
                        : <RiSettingsLine 
                            className="common-btn "
                            onClick={toggleSettings}
                            title="settings"
                          />
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
