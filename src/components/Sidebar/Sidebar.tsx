import { useRef } from 'react'
import { useOutsideClickDetector } from '../../utils/customHooks'
import Fog from '../Fog/Fog'
import './Sidebar.scss'
import { BsBoxArrowLeft } from 'react-icons/bs'
import RecordList from '../RecordList/RecordList'
import { ROOT_ID } from '../../utils/taskService'

type Props = {
    isOpened: boolean,
    close: () => void,
    isSettingsOpened: boolean,
    projectId: string
}

const Sidebar = (props: Props) => {
    const { 
        isOpened, 
        close, 
        isSettingsOpened, 
        projectId 
    } = props

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
        <div 
            ref={leftPanelRef} 
            className={classes} 
            onClick={handleClick}
        >
            <Fog isDisplayed={isSettingsOpened} />
                <div className="top-panel">
                    <div className="row-btns">
                        <BsBoxArrowLeft 
                            onClick={close}
                            className="common-btn close-menu-btn"
                            title="hide projects list"
                        />
                    </div>
                </div>
            <RecordList 
                rootId={ROOT_ID}
                hasTitle
                isEditable={false}
                projectId={projectId}
            />
        </div>
    )
}

export default Sidebar
