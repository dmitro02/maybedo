import React, { useEffect, useRef } from 'react'
import './TaskList.scss'
import TaskRecord from '../TaskRecord/TaskRecord'
import AddTAsk from '../TaskRecord/AddTask'
import { ITask } from '../../types'
import Sortable from 'sortablejs';

interface IProps { tasks: ITask[], isActive?: boolean }

const TaskList = ({ tasks, isActive }: IProps) => {
    const thisList = useRef(null)

    useEffect(() => {
        const tl = thisList.current
        tl && new Sortable(tl, { animation: 150 });
    }, [])

    return (
        <div className="task-list" ref={thisList}>
            {tasks.map(
                task => <TaskRecord key={task.id} task={task} />
            )}
            {isActive && <AddTAsk />} 
        </div>
    )
}

export default TaskList