import React from 'react'
import './TaskRecord.scss'
import { ITask } from '../../types'
import { 
    useTasksContext, 
    addTaskAction,
    createTaskObj
} from '../../contexts/TasksContext'

const AddTask = () => {
    const [, dispatch ] = useTasksContext()

    const addTaskRecord = (e: any) => {
        if (!e.target.textContent.trim()) return
        const task: ITask = createTaskObj(e.target.textContent)
        e.target.textContent = ''
        dispatch(addTaskAction(task))
    }

    const preventEnterOnEmpty = (e: any) => {
        !e.target.textContent.trim() && e.key === 'Enter' && e.preventDefault()
    }

    return (  
        <div className="task-record add-record">
            <i className="material-icons add-mark">add</i>
            <span 
                className="task-content" 
                contentEditable="true"
                suppressContentEditableWarning={true}
                onInput={addTaskRecord}
                onKeyPress={preventEnterOnEmpty}
            ></span>
        </div>
    )
}

export default AddTask