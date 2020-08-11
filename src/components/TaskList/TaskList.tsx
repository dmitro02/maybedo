import React from 'react'
import { useTasksContext } from '../../contexts/TasksContext'
import { ITask } from '../../types'
import { 
    RecordConfig, 
    RecordActions 
} from '../Record/Record'
import './TaskList.scss'
import {
    createTaskAction,
    updateTaskAction,
    deleteTaskAction,
    moveTaskAction
} from '../../contexts/actionCreators'
import RecordList from '../RecordList/RecordList'

const TaskList = () => {
    const [ store, dispatch ] = useTasksContext()

    const root = store.rootProject.tasks.find((p: ITask) => p.path === store.currentProjectPath)

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

    const recordActions: RecordActions = {
        updateRecord: (item: ITask) => dispatch(updateTaskAction(item)),
        deleteRecord: (item: ITask) => dispatch(deleteTaskAction(item))
    }

    return (
        <RecordList 
            classNames={['task-list']}
            root={root}
            createRecordAction={createTaskAction}
            moveRecordAction={moveTaskAction}
            setTitle={(item: ITask) => dispatch(updateTaskAction(item))}
            activeRecordConfig={activeRecordConfig}
            completedRecordConfig={completedRecordConfig}
            recordActions={recordActions}
        />
    )
}

export default TaskList
