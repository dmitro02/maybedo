import React from 'react'
import './Tasks.scss'
import TaskList from '../TaskList/TaskList'
import { useTasksContext } from '../../contexts/TasksContext'

const Tasks = () => {
    const [ contex ] = useTasksContext()

    const { activeTasks, completedTasks, editedTaskId } = contex

    return (
        <div className="tasks-box">
            <TaskList tasks={activeTasks} isActive={true} editedTaskId={editedTaskId}/>
            <div className={'divider' + (!completedTasks.length ? ' hidden' : '')} />
            <TaskList tasks={completedTasks} editedTaskId={editedTaskId}/>
        </div>
    )
}

export default Tasks