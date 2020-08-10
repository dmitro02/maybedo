import React from 'react'
import { useTasksContext } from '../../contexts/TasksContext'
import { ITask } from '../../types'
import { 
    RecordConfig, 
    RecordActions 
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

    const activeRecordConfig: RecordConfig = {
        listName: LIST_NAME,
        useCheckMark: true,
        useDeleteBtn: true,
        useDragBtn: true,
        isEditable: true
    }

    const completedRecordConfig: RecordConfig = { 
        ...activeRecordConfig, 
        useDragBtn: false
    }

    const recordActions: RecordActions = {
        updateRecord: (item: ITask) => dispatch(updateTaskAction(item)),
        deleteRecord: (item: ITask) => dispatch(deleteTaskAction(item))
    }

    return (
        <RecordList 
            listName={LIST_NAME}
            classNames={['task-list']}
            root={store.rootProject.tasks.find((p: ITask) => p.id === store.currentProjectId)}
            createRecordAction={createTaskAction}
            moveRecordAction={moveTaskAction}
            setTitle={(item: ITask) => dispatch(setProjectTitleAction(item.text))}
            activeRecordConfig={activeRecordConfig}
            completedRecordConfig={completedRecordConfig}
            recordActions={recordActions}
        />
    )
}

export default TaskList
