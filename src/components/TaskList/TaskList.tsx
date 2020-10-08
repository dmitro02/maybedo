import React from 'react'
import { useTasksContext } from '../../contexts/TasksContext'
import { Task } from '../../types'
import { RecordConfig } from '../Record/Record'
import './TaskList.scss'
import RecordList from '../RecordList/RecordList'

const activeRecordConfig: RecordConfig = {
    useDragBtn: true,
    isEditable: true
}

const completedRecordConfig: RecordConfig = { isEditable: true } 

const titleRecordConfig: RecordConfig = {
    isEditable: true, 
    isTitle: true
}

const TaskList = () => {
    const [ store ] = useTasksContext()

    const { tasks } = store.rootProject

    const root = tasks.length 
        ? tasks.find((p: Task) => p.path === store.rootProject.selectedSubTaskPath)
        : null

    if (!root) return null

    return (
        <RecordList 
            classNames={['task-list']}
            root={root}
            activeRecordConfig={activeRecordConfig}
            completedRecordConfig={completedRecordConfig}
            titleRecordConfig={titleRecordConfig}
        />
    )
}

export default TaskList
