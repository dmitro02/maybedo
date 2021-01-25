import React from 'react'
import RecordList from '../RecordList/RecordList'
import { RecordConfig } from '../Record/Record'
import { Task } from '../../types'
import './SubTaskList.scss'

const activeRecordConfig: RecordConfig = { isEditable: true }

const completedRecordConfig: RecordConfig = { isEditable: true }

type Props = { 
    task: Task,
    isDisplayed?: boolean
}

const SubTaskList = ({ task, isDisplayed = false }: Props) => {
    return (
        isDisplayed
            ? <RecordList 
                classNames={['subtasks-list']}
                root={task}
                activeRecordConfig={activeRecordConfig}
                completedRecordConfig={completedRecordConfig}
            />
            : null   
    )
}

export default SubTaskList