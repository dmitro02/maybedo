import React, { useRef, useEffect } from 'react'
import './Tasks.scss'
import { 
    useTasksContext, 
    createTaskObj
} from '../../contexts/TasksContext'
import {
    setProjectTitleAction,
    createTaskAction,
    updateTaskAction,
    deleteTaskAction,
    updateTasksAction
} from '../../contexts/actionCreators'
import Title from '../Title/Title'
import Divider from '../Divider/Divider'
import AddRecord from '../Record/AddRecord'
import { ITask, IProject } from '../../types'
import Record, { IRecordConfig, IRecordActions } from '../Record/Record'
import Sortable from 'sortablejs';

const LIST_NAME = 'tasks'

const Tasks = () => {
    const [ store, dispatch ] = useTasksContext()

    const project = store.projects.find((p: IProject) => p.id === store.currentProjectId)

    const activeTasks = project.tasks.filter((t: ITask) => !t.isDone)
    const completedTasks = project.tasks.filter((t: ITask) => t.isDone)

    const activeTaskListRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const tl = activeTaskListRef.current
        tl && new Sortable(tl, {
            animation: 150, 
            onEnd: (e: any) => {
                let { tasks } = project

                const movedTaskId = parseInt(e.item.id.split(':')[1])
                const movedTask = tasks.find((t: ITask) => t.id === movedTaskId)

                tasks = tasks.filter((t: ITask) => t.id !== movedTaskId)

                let movedTaskNewIndex

                if (e.newIndex === 0) {
                    movedTaskNewIndex = 0
                } else {
                    const taskToPlaceAfterId = parseInt(e.item.previousSibling.id.split(':')[1])
                    const taskToPlaceAfterIndex =  
                            tasks.findIndex((t: ITask) => t.id === taskToPlaceAfterId)
                    movedTaskNewIndex = taskToPlaceAfterIndex + 1
                }

                tasks.splice(movedTaskNewIndex, 0, movedTask)

                dispatch(updateTasksAction(tasks))
            }
        })
    }, [dispatch, project])

    const setTitle = (text: string) => dispatch(setProjectTitleAction(text))

    const createRecord = (text: string) => {
        const item: ITask = createTaskObj(text)
        dispatch(createTaskAction(item, LIST_NAME))
    }

    const activeRecordConfig: IRecordConfig = {
        listName: LIST_NAME,
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

    const recordActions: IRecordActions = {
        updateRecord: updateTaskAction,
        deleteRecord: deleteTaskAction
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
                            actions={recordActions}
                        />
                )}
            </div>
            <AddRecord addNewRecord={createRecord}/>
            <Divider isHidden={!completedTasks.length} />
            <div className="completed-tasks">
                {completedTasks.map(
                    (task: ITask) => 
                        <Record 
                            key={task.id} 
                            item={task} 
                            config={completedRecordConfig}
                            actions={recordActions}
                        />
                )}
            </div>
        </div>
    )
}

export default Tasks
