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
import { ITask } from '../../types'
import Record, { IRecordConfig, IRecordActions } from '../Record/Record'
import Sortable from 'sortablejs';

const LIST_NAME = 'tasks'

const Tasks = () => {
    const [ store, dispatch ] = useTasksContext()
    
    const project = store.rootProject.tasks.find((p: ITask) => p.id === store.currentProjectId)

    const activeTasks = project.tasks.filter((t: ITask) => !t.isDone)
    const completedTasks = project.tasks.filter((t: ITask) => t.isDone)

    const activeItemListRef = useRef<HTMLDivElement>(null)

    const handleItemMove = (e: any) => {
        const movedItemId = parseInt(e.item.id.split(':')[1])
        const sibling = e.item.previousSibling
        const siblingId = sibling 
            ? parseInt(sibling.id.split(':')[1])
            : null
        dispatch(moveTaskAction(movedItemId, siblingId))
    }

    useEffect(() => {
        new Sortable(activeItemListRef.current!, {
            animation: 150, 
            onEnd: handleItemMove
        })
    })

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
            <Title 
                title={project.text} 
                setTitle={setTitle} 
                isEditable={true} 
            />
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
