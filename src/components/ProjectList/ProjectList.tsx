import React from 'react'
import { useTasksContext } from '../../contexts/TasksContext'
import { ITask } from '../../types'
import './ProjectList.scss'
import {
    createProjectAction,
    updateProjectAction,
    deleteProjectAction,
    setCurrentProjectIdAction,
    moveProjectAction
} from '../../contexts/actionCreators'
import RecordList from '../RecordList/RecordList'
import { IRecordConfig } from '../Record/Record'

const LIST_NAME = 'projects'

const ProjectList = () => {
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

    return (
        <RecordList 
            listName={LIST_NAME}
            root={store.rootProject}
            createRecordAction={createProjectAction}
            moveRecordAction={moveProjectAction}
            selectRecord={(item: ITask) => dispatch(setCurrentProjectIdAction(item))}
            updateRecord={(item: ITask) => dispatch(updateProjectAction(item))}
            deleteRecord={(item: ITask) => dispatch(deleteProjectAction(item))}
            setTitle={() => {}}
            isTitleEditable={false}
            activeRecordConfig={activeRecordConfig}
            completedRecordConfig={completedRecordConfig}
        />
    )
}

export default ProjectList