import { useState } from 'react'
import { Task, Priorities } from '../../types'
import './Priority.scss'

type Props = { task: Task }

const Priority = ({ task }: Props) => {
    const [ showSelector, setShowSelector ] = useState(false)

    const handleClickOnSwitch = (e: any) => {
        const el = e.target as HTMLDivElement        
        task.priority = parseInt(el.textContent!)
        setShowSelector(false)
    }

    return (
        <div className="priotity-box">
            {showSelector 
                ? <div className="priotity-switch" onClick={handleClickOnSwitch}>
                    <div>{Priorities.Critical}</div>
                    <div>{Priorities.Major}</div>
                    <div>{Priorities.Normal}</div>
                    <div>{Priorities.Minor}</div>
                    <div>{Priorities.Trivial}</div>
                </div> 
                : <div className="priotity-current" onClick={() => setShowSelector(true)}>
                    <div>{task.priority || Priorities.Trivial}</div>
                </div>
            }
        </div>
    )
}

export default Priority