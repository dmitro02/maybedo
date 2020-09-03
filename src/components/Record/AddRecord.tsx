import React, { memo } from 'react'
import './Record.scss'
import { createTaskObj, useTasksContext } from '../../contexts/TasksContext'
import { constructNewPath } from '../../utils/pathUtils'
import { ITask } from '../../types'
import { createTaskAction } from '../../contexts/actionCreators'

const AddRecord = ({ root }: { root: ITask }) => {
    const [ , dispatch ] = useTasksContext()
    
    const createRecord = (e: any) => {
        const taskText = e.target.textContent.trim()
        if (!taskText) return
        const item: ITask = createTaskObj(constructNewPath(root), taskText)
        dispatch(createTaskAction(item))
        e.target.textContent = ''
    }

    const preventEnterOnEmpty = (e: any) => {
        !e.target.textContent.trim() && e.key === 'Enter' && e.preventDefault()
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

export default memo(AddRecord)