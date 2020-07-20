import React from 'react'
import './TaskRecord.scss'
import { ITask } from '../../types'
import { 
    useTasksContext, 
    addTaskAction 
} from '../../contexts/TasksContext'
import { createTaskObj } from '../../objectFactory' 

const AddTask = () => {
    const [, dispatch ] = useTasksContext()

    const addTaskRecord = (e: any) => {
        if (!e.target.textContent) return
        const task: ITask = createTaskObj(e.target.textContent)
        e.target.textContent = ''
        dispatch(addTaskAction(task))
    }

    return (  
        <div className="task-record add-record">
            <i className="material-icons add-mark">add</i>
            <span 
                className="task-content" 
                contentEditable="true"
                suppressContentEditableWarning={true}
                onInput={addTaskRecord}
            ></span>
        </div>
    )
}

export default AddTask