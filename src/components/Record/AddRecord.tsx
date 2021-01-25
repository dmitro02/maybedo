import React, { memo } from 'react'
import './Record.scss'
import { useTasksContext } from '../../contexts/TasksContext'
// import { constructNewPath } from '../../utils/pathUtils'
import { Task } from '../../types'
import { AddButton, EmptyButton } from '../Buttons/Buttons'
import { createTask, selectTask } from '../../utils/TaskTree'

const AddRecord = ({ root }: { root: Task }) => {
    const { actions } = useTasksContext()
    
    const createRecord = (e: any) => {
        const taskText = e.target.textContent.trim()
        if (!taskText) return
        const task: Task = new Task(taskText, root)
        task.isNew = true
        createTask(task)
        selectTask(task)
        e.target.textContent = ''
        actions.cascadingUpdate()
    }

    return (  
        <div className="record add-record">
            <div className="row-btns">
                <AddButton />
            </div>
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