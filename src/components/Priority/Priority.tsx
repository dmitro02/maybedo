import { useRef, useState } from 'react'
import { Task, Priorities } from '../../types'
import { useOutsideClickDetector } from '../../utils/customHooks'
import './Priority.scss'

type Props = { task: Task }

const Priority = ({ task }: Props) => {
    const [ showSelector, setShowSelector ] = useState(false)

    const openSelector = () => setShowSelector(true)
    const closeSelector = () => setShowSelector(false)

    const wrapperRef = useRef(null)
    useOutsideClickDetector(wrapperRef, closeSelector, showSelector)

    const handleClickOnSwitch = (e: any) => {
        const el = e.target as HTMLDivElement        
        task.priority = parseInt(el.textContent!)
        closeSelector()
    }

    return (
        <div className="priotity-box">
            {showSelector 
                ? <div 
                    className="priotity-switch" 
                    onClick={handleClickOnSwitch} 
                    ref={wrapperRef}
                >
                    <div><div>{Priorities.Critical}</div></div>
                    <div><div>{Priorities.Major}</div></div>
                    <div><div>{Priorities.Normal}</div></div>
                    <div><div>{Priorities.Minor}</div></div>
                    <div><div>{Priorities.Trivial}</div></div>
                </div> 
                : <div className="priotity-current" onClick={openSelector}>
                    <div>{task.priority || Priorities.Trivial}</div>
                </div>
            }
        </div>
    )
}

export default Priority
