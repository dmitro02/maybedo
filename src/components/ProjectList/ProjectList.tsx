import React from 'react'
import { useTasksContext } from '../../contexts/TasksContext'
import './ProjectList.scss'
import RecordList from '../RecordList/RecordList'
import { RecordConfig } from '../Record/Record'

const activeRecordConfig: RecordConfig = { useDragBtn: true }

const titleRecordConfig: RecordConfig = { isTitle: true }

const ProjectList = () => {
    const [ store ] = useTasksContext()

    const root = store.taskList

    return (
        <RecordList 
            classNames={['project-list']}
            root={root}
            activeRecordConfig={activeRecordConfig}
            completedRecordConfig={{}}
            titleRecordConfig={titleRecordConfig}
        />
    )
}

export default ProjectList
