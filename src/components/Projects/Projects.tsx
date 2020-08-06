import React, { useEffect, useRef } from 'react'
import './Projects.scss'
import Divider from '../Divider/Divider'
import AddRecord from '../Record/AddRecord'
import Record, { IRecordConfig, IRecordActions } from '../Record/Record'
import { ITask } from '../../types'
import { 
    useTasksContext, 
    createTaskObj
} from '../../contexts/TasksContext'
import {
    createProjectAction,
    updateProjectAction,
    deleteProjectAction,
    setCurrentProjectIdAction,
    moveProjectAction
} from '../../contexts/actionCreators'
import Sortable from 'sortablejs'
import Title from '../Title/Title'

const LIST_NAME = 'projects'

const Projects = () => {

    const [ store, dispatch ] = useTasksContext()

    const project = store.rootProject

    const activeTasks = project.tasks.filter((t: ITask) => !t.isDone)
    const completedTasks = project.tasks.filter((t: ITask) => t.isDone)

    const activeItemListRef = useRef<HTMLDivElement>(null)

    const handleItemMove = (e: any) => {
        const movedItemId = parseInt(e.item.id.split(':')[1])
        const sibling = e.item.previousSibling
        const siblingId = sibling 
            ? parseInt(sibling.id.split(':')[1])
            : null
        dispatch(moveProjectAction(movedItemId, siblingId))
    }

    useEffect(() => {
        new Sortable(activeItemListRef.current!, {
            animation: 150, 
            onEnd: handleItemMove
        })
    })

    const createRecord = (text: string) => {
        const item: ITask = createTaskObj(text)
        dispatch(createProjectAction(item, LIST_NAME))
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
            dispatch(updateProjectAction(item)),
        deleteRecord: (item: ITask) => 
            dispatch(deleteProjectAction(item)),
        selectRecord: (item: ITask) => 
            dispatch(setCurrentProjectIdAction(item))
    }

    return (
        <div className="projects">
            <Title title={project.text} />
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

export default Projects