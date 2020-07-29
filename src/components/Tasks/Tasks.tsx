import React from 'react'
import './Tasks.scss'
import TaskList from '../TaskList/TaskList'
import { 
    useTasksContext, 
    setTitleAction,
    addTaskAction,
    createTaskObj
} from '../../contexts/TasksContext'
import Title from '../Title/Title'
import Divider from '../Divider/Divider'
import AddTask from '../Record/AddRecord'
import { ITask } from '../../types'

const Tasks = () => {
    const [ context, dispatch ] = useTasksContext()

    const activeTasks = context.tasks.filter((t: ITask) => !t.isDone)
    const completedTasks = context.tasks.filter((t: ITask) => t.isDone)

    const setTitle = (text: string) => dispatch(setTitleAction(text))

    const addTaskRecord = (e: any) => {
        const task: ITask = createTaskObj(e.target.textContent)
        dispatch(addTaskAction(task))
    }

    return (
        <div className="tasks-box">
            <Title title={context.text} setTitle={setTitle}/>
            <Divider />
            <TaskList tasks={activeTasks} />
            <AddTask addRecord={addTaskRecord}/>
            <Divider isHidden={!completedTasks.length} />
            <TaskList tasks={completedTasks} />
        </div>
    )
}

export default Tasks