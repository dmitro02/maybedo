import React from 'react'
import './TaskRecord.scss'
import { ITask } from '../../types'
import { 
    useTasksContext, 
    moveTaskAction 
} from '../../contexts/TasksContext'

interface IProps { task: ITask }

const TaskRecord = ({ task }: IProps) => {
    const { isDone, data } = task

    const [, dispatch ] = useTasksContext()

    const handleClickOnCheckbox = (e: any) => {
        task.isDone = !isDone
        dispatch(moveTaskAction(task))
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