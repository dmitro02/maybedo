import { useState, useRef } from 'react'
import Task, { Priorities } from '../../classes/Task'
import { RiFilePptFill } from 'react-icons/ri'
import { useOutsideClickDetector } from '../../utils/customHooks'

const PRIORITY_NAMES = new Map([
    [Priorities.Trivial, 'Trivial'],
    [Priorities.Minor, 'Minor'],
    [Priorities.Normal, 'Normal'],
    [Priorities.Major, 'Major'],
    [Priorities.Critical, 'Critical'],
    [undefined, 'Trivial'],
])

type Props = { 
    task: Task,
    closeMenu: () => void,
    update: (task: Task) => void
}

const Priority = (props: Props) => {
    const {
        task,
        closeMenu,
        update
    } = props

    const [ showSelector, setShowSelector ] = useState(false)

    const openSelector = (e: any) => {
        e.stopPropagation()
        setShowSelector(true)
    }
    const closeSelector = () => setShowSelector(false)

    const switchRef = useRef(null)
    useOutsideClickDetector(switchRef, closeSelector, showSelector)

    const handleClickOnSwitch = (e: any) => {
        e.stopPropagation()

        const el = e.target as HTMLDivElement   
        const newPrio = parseInt(el.textContent!)     
        if (newPrio !== task.priority) {
            task.priority = newPrio
            update(task)
        }
        closeMenu() 
    }

    return (
        <>
            {showSelector 
                ? <div 
                    className="record-menu-row priority-switch" 
                    onClick={handleClickOnSwitch}
                    ref={switchRef} 
                >
                    <div className="inline-menu-btn"><div>{Priorities.Trivial}</div></div>
                    <div className="inline-menu-btn"><div>{Priorities.Minor}</div></div>
                    <div className="inline-menu-btn"><div>{Priorities.Normal}</div></div>
                    <div className="inline-menu-btn"><div>{Priorities.Major}</div></div>
                    <div className="inline-menu-btn"><div>{Priorities.Critical}</div></div>
                </div> 
                : <div 
                    className="record-menu-row" 
                    onClick={openSelector} 
                    title="Set task priotity"
                >
                    <RiFilePptFill className="menu-item-icon" />
                    <div className="menu-item-text">
                        {PRIORITY_NAMES.get(task.priority)}
                    </div>
                </div>
            }
        </>
    )
}

export default Priority
