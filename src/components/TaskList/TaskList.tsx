import React from 'react'
import { useTasksContext } from '../../contexts/TasksContext'
import { ITask } from '../../types'
import { 
    IRecordConfig, 
    IRecordActions 
} from '../Record/Record'
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
        isEditable: false
    }

    const completedRecordConfig: IRecordConfig = { 
        ...activeRecordConfig, 
        useDragBtn: false
    }

    const recordActions: IRecordActions = {
        updateRecord: (item: ITask) => dispatch(updateTaskAction(item)),
        deleteRecord: (item: ITask) => dispatch(deleteTaskAction(item)),
        selectRecord: () => {}
    }

    return (
        <RecordList 
            listName={LIST_NAME}
            root={store.rootProject.tasks.find((p: ITask) => p.id === store.currentProjectId)}
            createRecordAction={createTaskAction}
            moveRecordAction={moveTaskAction}
            setTitle={(title: string) => dispatch(setProjectTitleAction(title))}
            isTitleEditable={true}
            activeRecordConfig={activeRecordConfig}
            completedRecordConfig={completedRecordConfig}
            recordActions={recordActions}
        />
    )
}

export default TaskList
