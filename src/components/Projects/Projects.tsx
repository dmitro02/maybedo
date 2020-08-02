import React from 'react'
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
    moveProjectAction
} from '../../contexts/actionCreators'

const Projects = () => {

    const [ store, dispatch ] = useTasksContext()

    const createRecord = (text: string) => {
        const item: IProject = createProjectObj(text)
        dispatch(createProjectAction(item))
    }

    const recordConfig: IRecordConfig = {
        useCheckMark: true,
        useDeleteBtn: true,
        useDragBtn: false,
        useEditBtn: true,
        isEditable: true
    }

    const recordActions: IRecordActions = {
        updateRecord: updateProjectAction,
        deleteRecord: deleteProjectAction,
        moveRecord: moveProjectAction
    }

    const projects: IProject[] = store.projects

    return (
        <div className="projects">
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