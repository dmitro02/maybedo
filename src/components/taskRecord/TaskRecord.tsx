import React, { useContext } from 'react'
import './TaskRecord.scss'
import { ITask } from '../../types'
import { TasksContext } from '../../contexts/TasksContext'

interface IProps { task: ITask }

const TaskRecord = ({ task }: IProps) => {
    const { isDone, data } = task

    const [, dispatch ] = useContext(TasksContext)

    const handleClickOnCheckbox = (e: any) => {
        task.isDone = !isDone
        task.isDone 
            ? dispatch({ type: 'MARK_AS_COMPLETED', task })
            : dispatch({ type: 'MARK_AS_ACTIVE', task })
    }

    return (
        <div className={'task-record ' + (isDone ? 'task-done' : 'task-undone')}>
            <input 
                type="checkbox" 
                defaultChecked={isDone} 
                onClick={handleClickOnCheckbox}
            />
            <span>{data}</span>
        </div>
    )
}

export default TaskRecord