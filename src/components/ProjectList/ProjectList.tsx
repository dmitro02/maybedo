import React from 'react'
import { useTasksContext } from '../../contexts/TasksContext'
import './ProjectList.scss'
import RecordList from '../RecordList/RecordList'
import { RecordConfig } from '../Record/Record'

const ProjectList = () => {
    const [ store ] = useTasksContext()

    const root = store.rootProject

    const activeRecordConfig: RecordConfig = {
        listPath: root.path,
        useCheckMark: true,
        useDeleteBtn: true,
        useDragBtn: true
    }

    const completedRecordConfig: RecordConfig = { 
        ...activeRecordConfig, 
        useDragBtn: false
    }

    return (
        <RecordList 
            classNames={['project-list']}
            root={root}
            activeRecordConfig={activeRecordConfig}
            completedRecordConfig={completedRecordConfig}
        />
    )
}

export default ProjectList
