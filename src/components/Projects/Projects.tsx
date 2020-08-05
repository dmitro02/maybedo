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

    const recordConfig: IRecordConfig = {
        listName: LIST_NAME,
        useCheckMark: true,
        useDeleteBtn: true,
        useDragBtn: true,
        useEditBtn: false,
        isEditable: false
    }

    const recordActions: IRecordActions = {
        updateRecord: (item: ITask) => 
            dispatch(updateProjectAction(item)),
        deleteRecord: (item: ITask) => 
            dispatch(deleteProjectAction(item)),
        selectRecord: (item: ITask) => 
            dispatch(setCurrentProjectIdAction(item))
    }

    const projects: ITask[] = store.projects

    return (
        <div className="projects" ref={activeItemListRef}>
            <Title title="Projects" />
            <Divider />
            {projects.map(
                project => 
                    <Record 
                        key={project.id} 
                        item={project} 
                        config={recordConfig}
                        actions={recordActions}
                    />
            )}
            <AddRecord addNewRecord={createRecord}/>
        </div>  
    )
}

export default Projects