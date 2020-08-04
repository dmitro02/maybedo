import React, { useEffect, useRef } from 'react'
import './Projects.scss'
import Divider from '../Divider/Divider'
import AddRecord from '../Record/AddRecord'
import Record, { IRecordConfig, IRecordActions } from '../Record/Record'
import { IProject } from '../../types'
import { 
    useTasksContext, 
    createProjectObj
} from '../../contexts/TasksContext'
import {
    createProjectAction,
    updateProjectAction,
    deleteProjectAction,
    setCurrentProjectIdAction,
    updateProjectsAction
} from '../../contexts/actionCreators'
import Sortable from 'sortablejs'

const LIST_NAME = 'projects'

const Projects = () => {

    const [ store, dispatch ] = useTasksContext()

    const activeItemListRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const l = activeItemListRef.current
        l && new Sortable(l, {
            animation: 150, 
            onEnd: (e: any) => {
                let { projects: items } = store

                const movedItemId = parseInt(e.item.id.split(':')[1])
                const movedItem = items.find((it: IProject) => it.id === movedItemId)

                items = items.filter((it: IProject) => it.id !== movedItemId)

                let movedItemNewIndex

                if (e.newIndex === 0) {
                    movedItemNewIndex = 0
                } else {
                    const itemToPlaceAfterId = parseInt(e.item.previousSibling.id.split(':')[1])
                    const itemToPlaceAfterIndex =  
                        items.findIndex((it: IProject) => it.id === itemToPlaceAfterId)
                    movedItemNewIndex = itemToPlaceAfterIndex + 1
                }

                items.splice(movedItemNewIndex, 0, movedItem)

                dispatch(updateProjectsAction(items))
            }
        })
    }, [dispatch, store])

    const createRecord = (text: string) => {
        const item: IProject = createProjectObj(text)
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
        updateRecord: (item: IProject) => 
            dispatch(updateProjectAction(item)),
        deleteRecord: (item: IProject) => 
            dispatch(deleteProjectAction(item)),
        selectRecord: (item: IProject) => 
            dispatch(setCurrentProjectIdAction(item))
    }

    const projects: IProject[] = store.projects

    return (
        <div className="projects" ref={activeItemListRef}>
            <header>Projects</header>
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