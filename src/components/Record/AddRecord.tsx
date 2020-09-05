import React, { memo } from 'react'
import './Record.scss'
import { useTasksContext } from '../../contexts/TasksContext'
import { constructNewPath } from '../../utils/pathUtils'
import { Task } from '../../types'
import { createTaskAction } from '../../contexts/actionCreators'

const AddRecord = ({ root }: { root: Task }) => {
    const [ , dispatch ] = useTasksContext()
    
    const createRecord = (e: any) => {
        const taskText = e.target.textContent.trim()
        if (!taskText) return
        const item: Task = new Task(constructNewPath(root), taskText)
        dispatch(createTaskAction(item))
        e.target.textContent = ''
    }

    return (  
        <div className="record add-record">
            <i className="material-icons add-mark">add</i>
            <span 
                className="item-content" 
                contentEditable="true"
                suppressContentEditableWarning={true}
                onInput={createRecord}
                onKeyPress={preventEnterOnEmpty}
            ></span>
        </div>
    )
}

const preventEnterOnEmpty = (e: any) => {
    !e.target.textContent.trim() && e.key === 'Enter' && e.preventDefault()
}

export default memo(AddRecord)