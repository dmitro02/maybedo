import React from 'react'
import './Tasks.scss'
import TaskList from '../TaskList/TaskList'
import { useTasksContext } from '../../contexts/TasksContext'
import Title from '../Title/Title'
import Divider from '../Divider/Divider'
import { ITask } from '../../types'

const Tasks = () => {
    const [ context ] = useTasksContext()

    const activeTasks = context.tasks.filter((t: ITask) => !t.isDone)
    const completedTasks = context.tasks.filter((t: ITask) => t.isDone)
    
    return (
        <>
            <div className="tasks-box">
                <Title title={context.title} />
                <Divider />
                <TaskList tasks={activeTasks} isActive={true} />
                <Divider isHidden={!completedTasks.length} />
                <TaskList tasks={completedTasks} />
            </div>
            <button 
                style={{position: "fixed", top: 0, right: 0}}
                onClick={() => console.log(context)}>context</button>
        </>
    )
}

export default Tasks