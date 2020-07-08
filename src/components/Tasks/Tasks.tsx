import React, { useState } from 'react'
import './Tasks.scss'
import TaskList from '../TaskList/TaskList'
import { TASKS } from '../../tasks'
import { Task } from '../../types'

interface State {
    activeTasks: Task[]
    completedTasks: Task[]
  } 

const Tasks = () => {
    const [ allTasks, setAllTasks ] = 
        useState<State>(getInitialTaskList())

    return (
        <div className="tasks-box">
            <TaskList tasks={allTasks.activeTasks} />
            <TaskList tasks={allTasks.completedTasks} />
        </div>
    )
}

const getInitialTaskList = () => {
    const activeTasks: Task[] = []
    const completedTasks: Task[] = []
    TASKS.forEach(task => {
        task.isDone 
            ? completedTasks.push(task)
            : activeTasks.push(task)
    })
    return { activeTasks, completedTasks }
}

export default Tasks