import React from 'react'
import { useTasksContext } from '../../contexts/TasksContext'
import { ITask } from '../../types'
import { IRecordConfig } from '../Record/Record'
import './TaskList.scss'
import {
    setProjectTitleAction,
    createTaskAction,
    updateTaskAction,
    deleteTaskAction,
    moveTaskAction
} from '../../contexts/actionCreators'
import RecordList from '../RecordList/RecordList'

const LIST_NAME = 'tasks'

const TaskList = () => {
    const [ store, dispatch ] = useTasksContext()

    const activeRecordConfig: IRecordConfig = {
        listName: LIST_NAME,
        useCheckMark: true,
        useDeleteBtn: true,
        useDragBtn: true,
        useEditBtn: false,
        isEditable: true
    }

    const completedRecordConfig: IRecordConfig = { 
        ...activeRecordConfig, 
        useDragBtn: false
    }

    return (
        <RecordList 
            listName={LIST_NAME}
            root={store.rootProject.tasks.find((p: ITask) => p.id === store.currentProjectId)}
            createRecordAction={createTaskAction}
            moveRecordAction={moveTaskAction}
            selectRecord={() => {}}
            updateRecord={(item: ITask) => dispatch(updateTaskAction(item))}
            deleteRecord={(item: ITask) => dispatch(deleteTaskAction(item))}
            setTitle={(title: string) => dispatch(setProjectTitleAction(title))}
            isTitleEditable={true}
            activeRecordConfig={activeRecordConfig}
            completedRecordConfig={completedRecordConfig}
        />
    )
}

export default TaskList
