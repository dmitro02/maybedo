import React from 'react'
import './Projects.scss'
import Divider from '../Divider/Divider'
import Record, { IRecordConfig } from '../Record/Record'
import { IProject } from '../../types'
import { useTasksContext } from '../../contexts/TasksContext'

const Projects = () => {

    const [ context, dispatch ] = useTasksContext()

    const recordConfig: IRecordConfig = {
        useCheckMark: true,
        useDeleteBtn: true,
        useDragBtn: false,
        useEditBtn: true,
        isEditable: true
    }

    const projects: IProject[] = []

    return (
        <div className="projects">
            <header>Projects</header>
            <Divider />
            {projects.map(
                project => <Record key={project.id} task={project} config={recordConfig}/>
            )}
        </div>  
    )
}

export default Projects