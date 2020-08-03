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
    moveTaskAction
} from '../../contexts/actionCreators'
import Title from '../Title/Title'
import Divider from '../Divider/Divider'
import AddRecord from '../Record/AddRecord'
import { ITask, IProject } from '../../types'
import Record, { IRecordConfig, IRecordActions } from '../Record/Record'
import Sortable from 'sortablejs';

const LIST_NAME = 'tasks'

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
        deleteRecord: deleteTaskAction,
        moveRecord: moveTaskAction
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
