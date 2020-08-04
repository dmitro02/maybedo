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

    const activeItemListRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const l = activeItemListRef.current
        l && new Sortable(l, {
            animation: 150, 
            onEnd: (e: any) => {
                let { tasks: items } = project

                const movedItemId = parseInt(e.item.id.split(':')[1])
                const movedItem = items.find((it: ITask) => it.id === movedItemId)

                items = items.filter((it: ITask) => it.id !== movedItemId)

                let movedItemNewIndex

                if (e.newIndex === 0) {
                    movedItemNewIndex = 0
                } else {
                    const itemToPlaceAfterId = parseInt(e.item.previousSibling.id.split(':')[1])
                    const itemToPlaceAfterIndex =  
                        items.findIndex((it: ITask) => it.id === itemToPlaceAfterId)
                    movedItemNewIndex = itemToPlaceAfterIndex + 1
                }

                items.splice(movedItemNewIndex, 0, movedItem)

                dispatch(updateTasksAction(items))
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
        updateRecord: (item: ITask) => 
            dispatch(updateTaskAction(item)),
        deleteRecord: (item: ITask) => 
            dispatch(deleteTaskAction(item)),
        selectRecord: () => {}
    }

    return (
        <div className="tasks-box">
            <Title title={project.text} setTitle={setTitle}/>
            <Divider />
            <div className="active-tasks" ref={activeItemListRef}>
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
