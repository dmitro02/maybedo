import { useRef } from 'react'
import { useOutsideClickDetector } from '../../utils/customHooks'
import taskStore from '../../classes/Store'
import { ArrowBackButton } from '../Buttons/Buttons'
import Fog from '../Fog/Fog'
import ProjectList from '../RecordList/ProjectList'
import './Sidebar.scss'

type Props = {
    isOpened: boolean,
    close: () => void,
    isSettingsOpened: boolean
}

const Sidebar = ({ isOpened, close, isSettingsOpened }: Props) => {
    const { taskList } = taskStore

    const leftPanelRef = useRef(null)
    useOutsideClickDetector(leftPanelRef, close, isOpened) 

    const handleClick = (e: any) => {
        const el = e.target as HTMLDivElement        
        if (el.getAttribute('contenteditable') === "false") close()
    }

    const classes = [
        'left-panel',
        isOpened ? 'panel-opened' : '',
        isSettingsOpened? 'no-scroll' : ''
    ].join(' ')

    return (
        <div ref={leftPanelRef} className={classes} onClick={handleClick}>
            <Fog isDisplayed={isSettingsOpened} />
                <div className="top-panel">
                    <div className="row-btns">
                        <ArrowBackButton 
                            action={close} 
                            classNames={['close-menu-btn']} 
                            title="hide projects list"
                        />
                    </div>
                </div>
            <ProjectList rootTask={taskList} />
        </div>
    )
}

export default Sidebar
