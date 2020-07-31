import React from 'react'
import './Tasks.scss'
import TaskList from '../TaskList/TaskList'
import { 
    useTasksContext, 
    createTaskObj
} from '../../contexts/TasksContext'
import {
    setTitleAction,
    addTaskAction
} from '../../contexts/actionCreators'
import Title from '../Title/Title'
import Divider from '../Divider/Divider'
import AddTask from '../Record/AddRecord'
import { ITask, IProject } from '../../types'

const Tasks = () => {
    const [ state, dispatch ] = useTasksContext()

    const project = state.projects.find((p: IProject) => p.id === state.currentProjectId)

    const activeTasks = project.tasks.filter((t: ITask) => !t.isDone)
    const completedTasks = project.tasks.filter((t: ITask) => t.isDone)

    const setTitle = (text: string) => dispatch(setTitleAction(text))

    const addTaskRecord = (text: string) => {
        const task: ITask = createTaskObj(text)
        dispatch(addTaskAction(task))
    }

    return (
        <div className="tasks-box">
            <Title title={project.text} setTitle={setTitle}/>
            <Divider />
            <TaskList tasks={activeTasks} />
            <AddTask addNewRecord={addTaskRecord}/>
            <Divider isHidden={!completedTasks.length} />
            <TaskList tasks={completedTasks} />
        </div>
    )
}

export default Tasks