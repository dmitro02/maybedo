import React from 'react'
import './Tasks.scss'
import TaskList from '../TaskList/TaskList'
import { 
    useTasksContext, 
    setTitleAction 
} from '../../contexts/TasksContext'
import Title from '../Title/Title'
import Divider from '../Divider/Divider'
import { ITask } from '../../types'

const Tasks = () => {
    const [ context, dispatch ] = useTasksContext()

    const activeTasks = context.tasks.filter((t: ITask) => !t.isDone)
    const completedTasks = context.tasks.filter((t: ITask) => t.isDone)

    const setTitle = (text: string) => dispatch(setTitleAction(text))

    return (
        <div className="tasks-box">
            <Title title={context.title} setTitle={setTitle}/>
            <Divider />
            <TaskList tasks={activeTasks} isActive={true} />
            <Divider isHidden={!completedTasks.length} />
            <TaskList tasks={completedTasks} />
        </div>
    )
}

export default Tasks