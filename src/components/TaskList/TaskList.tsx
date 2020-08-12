import React from 'react'
import { useTasksContext } from '../../contexts/TasksContext'
import { ITask } from '../../types'
import { RecordConfig } from '../Record/Record'
import './TaskList.scss'
import RecordList from '../RecordList/RecordList'

const TaskList = () => {
    const [ store ] = useTasksContext()

    const root = store.rootProject.tasks
        .find((p: ITask) => p.path === store.rootProject.selectedTaskPath)

    const activeRecordConfig: RecordConfig = {
        listPath: root.path,
        useCheckMark: true,
        useDeleteBtn: true,
        useDragBtn: true,
        isEditable: true
    }

    const completedRecordConfig: RecordConfig = { 
        ...activeRecordConfig, 
        useDragBtn: false
    }

    return (
        <RecordList 
            classNames={['task-list']}
            root={root}
            activeRecordConfig={activeRecordConfig}
            completedRecordConfig={completedRecordConfig}
        />
    )
}

export default TaskList
