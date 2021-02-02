import { memo, useEffect, useRef } from 'react'
import './Record.scss'
import { useTasksContext } from '../../contexts/TasksContext'
import { Task } from '../../types'
import { AddButton } from '../Buttons/Buttons'
import taskStore from '../../utils/taskStore'

const AddRecord = ({ root }: { root: Task }) => {
    const { actions } = useTasksContext()

    const editableRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        editableRef.current?.focus()
    }, [])
    
    const createRecord = (e: any) => {
        const taskText = e.target.textContent.trim()
        if (!taskText) return
        const task: Task = new Task(taskText, root)
        task.isNew = true
        taskStore.createTask(task)
        taskStore.selectTask(task)
        e.target.textContent = ''
        actions.triggerCascadingUpdate()
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
                ref={editableRef}
            ></span>
        </div>
    )
}

const preventEnterOnEmpty = (e: any) => {
    !e.target.textContent.trim() && e.key === 'Enter' && e.preventDefault()
}

export default memo(AddRecord)
