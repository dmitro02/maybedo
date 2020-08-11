import React from 'react'
import { useTasksContext } from '../../contexts/TasksContext'
import { ITask } from '../../types'
import './ProjectList.scss'
import {
    createTaskAction,
    updateTaskAction,
    deleteTaskAction,
    setCurrentProjectIdAction,
    moveTaskAction
} from '../../contexts/actionCreators'
import RecordList from '../RecordList/RecordList'
import { 
    RecordConfig, 
    RecordActions 
} from '../Record/Record'

const ProjectList = () => {
    const [ store, dispatch ] = useTasksContext()

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

    const recordActions: RecordActions = {
        updateRecord: (item: ITask) => dispatch(updateTaskAction(item)),
        deleteRecord: (item: ITask) => dispatch(deleteTaskAction(item)),
        selectRecord: (item: ITask) => dispatch(setCurrentProjectIdAction(item))
    }

    return (
        <RecordList 
            classNames={['project-list']}
            root={root}
            createRecordAction={createTaskAction}
            moveRecordAction={moveTaskAction}
            activeRecordConfig={activeRecordConfig}
            completedRecordConfig={completedRecordConfig}
            recordActions={recordActions}
        />
    )
}

export default ProjectList