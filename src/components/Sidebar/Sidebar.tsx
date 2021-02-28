import { 
    useEffect, 
    useRef, 
    useState 
} from 'react'
import { useOutsideClickDetector } from '../../utils/customHooks'
import taskStore from '../../utils/Store'
import { ArrowBackButton } from '../Buttons/Buttons'
// import Fog from '../Fog/Fog'
import ProjectList from '../RecordList/ProjectList'
import './Sidebar.scss'

const Sidebar = () => {
    const { taskList } = taskStore

    const [ isOpened, setIsOpened ] = useState(false)

    const open = () => {
        setIsOpened(true)
        !window.iAmRunningOnMobile && window.addEventListener('resize', close)
    }

    const close = () => {
        setIsOpened(false)
        window.removeEventListener('resize', close)
    }

    useEffect(() => {
        taskStore.subscribe('openSidebar', open)
        taskStore.subscribe('closeSidebar', close)

        return () => {
            taskStore.unsubscribe('openSidebar', open)
            taskStore.unsubscribe('closeSidebar', close)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const leftPanelRef = useRef(null)
    useOutsideClickDetector(leftPanelRef, close, isOpened) 

    return (
        <div ref={leftPanelRef} className={`left-panel${isOpened ? ' panel-opened' : ''}`}>
            {/* <Fog isDisplayed={isSettingsOpened} /> */}
                <div className="top-panel">
                    <div className="row-btns">
                        <ArrowBackButton 
                            action={close} 
                            classNames={['close-menu-btn']} 
                            title="hide projects list"
                        />
                    </div>
                </div>
            <ProjectList rootTask={taskList}/>
        </div>
    )
}

export default Sidebar
