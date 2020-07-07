import React, { useState } from 'react'
import './taskRecord.scss'

const TaskRecord = () => {
    const [isDone, setIsDone] = useState(false)

    const handleClickOnCheckbox = (e: any) => {
        setIsDone(prevIsDone => !prevIsDone)
    }

    return (
        <div className={'task-record ' + (isDone ? 'task-done' : 'task-undone')}>
            <input 
                type="checkbox" 
                checked={isDone} 
                onClick={handleClickOnCheckbox}
            />
            <span>record</span>
        </div>
    )
}



export default TaskRecord