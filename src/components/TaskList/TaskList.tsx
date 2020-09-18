import React from 'react'
import { useTasksContext } from '../../contexts/TasksContext'
import { Task } from '../../types'
import { RecordConfig } from '../Record/Record'
import './TaskList.scss'
import RecordList from '../RecordList/RecordList'
import Banner, { BannerTypes } from '../Banner/Banner'

const activeRecordConfig: RecordConfig = {
    useCheckMark: true,
    useDeleteBtn: true,
    useDragBtn: true,
    isEditable: true
}

const completedRecordConfig: RecordConfig = { 
    ...activeRecordConfig, 
    useDragBtn: false
}

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
        <>
            <Banner text="Success" type={BannerTypes.Success}/>
            <RecordList 
                classNames={['tasks-box', 'task-list']}
                root={root}
                activeRecordConfig={activeRecordConfig}
                completedRecordConfig={completedRecordConfig}
                titleRecordConfig={titleRecordConfig}
            />
        </>
    )
}

export default TaskList
