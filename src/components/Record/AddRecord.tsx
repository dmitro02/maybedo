import { memo, useEffect, useRef } from 'react'
import './Record.scss'
import Task from '../../classes/Task'
import { MdAdd } from 'react-icons/md'
import { createTask, selectTask } from '../../classes/Store'
 
const AddRecord = ({ root }: { root: Task }) => {
    const editableRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        !window.iAmRunningOnMobile && editableRef.current?.focus()
    }, [])
    
    const createRecord = (e: any) => {
        const taskText = e.target.textContent.trim()
        if (!taskText) return
        const task: Task = new Task(taskText, root)
        task.isNew = true
        createTask(task)
        task.isProject && selectTask(task)
        e.target.textContent = ''
    }

    return (  
        <div className="record add-record">
            <div className="row-btns">
                <MdAdd />
            </div>
            <div 
                className="item-content" 
                contentEditable="true"
                suppressContentEditableWarning={true}
                onInput={createRecord}
                onKeyPress={preventEnterOnEmpty}
                ref={editableRef}
            ></div>
        </div>
    )
}

const preventEnterOnEmpty = (e: any) => {
    !e.target.textContent.trim() && e.key === 'Enter' && e.preventDefault()
}

export default memo(AddRecord)
