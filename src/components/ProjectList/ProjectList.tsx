import React from 'react'
import { useTasksContext } from '../../contexts/TasksContext'
import './ProjectList.scss'
import RecordList from '../RecordList/RecordList'
import { RecordConfig } from '../Record/Record'

const activeRecordConfig: RecordConfig = {
    useCheckMark: true,
    useDeleteBtn: true,
    useDragBtn: true
}

const completedRecordConfig: RecordConfig = { 
    ...activeRecordConfig, 
    useDragBtn: false
}

const titleRecordConfig: RecordConfig = { isTitle: true }

const ProjectList = () => {
    const [ store ] = useTasksContext()

    const root = store.rootProject

    return (
        <RecordList 
            classNames={['tasks-box', 'project-list']}
            root={root}
            activeRecordConfig={activeRecordConfig}
            completedRecordConfig={completedRecordConfig}
            titleRecordConfig={titleRecordConfig}
        />
    )
}

export default ProjectList
