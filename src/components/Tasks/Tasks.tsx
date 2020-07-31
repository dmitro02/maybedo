import React, { useRef, useEffect } from 'react'
import './Tasks.scss'
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
import Record, { IRecordConfig } from '../Record/Record'
import Sortable from 'sortablejs';

const Tasks = () => {
    const [ state, dispatch ] = useTasksContext()

    const activeTaskListRef = useRef(null)

    useEffect(() => {
        const tl = activeTaskListRef.current
        tl && new Sortable(tl, { animation: 150 });
    }, [])

    const project = state.projects.find((p: IProject) => p.id === state.currentProjectId)

    const activeTasks = project.tasks.filter((t: ITask) => !t.isDone)
    const completedTasks = project.tasks.filter((t: ITask) => t.isDone)

    const setTitle = (text: string) => dispatch(setTitleAction(text))

    const addTaskRecord = (text: string) => {
        const task: ITask = createTaskObj(text)
        dispatch(addTaskAction(task))
    }

    const activeRecordConfig: IRecordConfig = {
        useCheckMark: true,
        useDeleteBtn: true,
        useDragBtn: true,
        useEditBtn: false,
        isEditable: true
    }

    const completedRecordConfig: IRecordConfig = { 
        ...activeRecordConfig, 
        useDragBtn: false 
    }

    return (
        <div className="tasks-box">
            <Title title={project.text} setTitle={setTitle}/>
            <Divider />
            <div className="active-tasks" ref={activeTaskListRef}>
                {activeTasks.map(
                    (task: ITask) => 
                        <Record 
                            key={task.id} 
                            item={task} 
                            config={activeRecordConfig}
                        />
                )}
            </div>
            <AddTask addNewRecord={addTaskRecord}/>
            <Divider isHidden={!completedTasks.length} />
            <div className="completed-tasks">
                {completedTasks.map(
                    (task: ITask) => 
                        <Record 
                            key={task.id} 
                            item={task} 
                            config={completedRecordConfig}
                        />
                )}
            </div>
        </div>
    )
}

export default Tasks