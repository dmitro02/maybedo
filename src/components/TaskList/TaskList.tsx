import { Task } from '../../types'
import { RecordConfig } from '../Record/Record'
import './TaskList.scss'
import RecordList from '../RecordList/RecordList'

const activeRecordConfig: RecordConfig = { isEditable: true }

const completedRecordConfig: RecordConfig = { isEditable: true } 

const titleRecordConfig: RecordConfig = {
    isEditable: true, 
    isTitle: true
}

type Props = {
    rootTask: Task | null
}

const TaskList = ({ rootTask }: Props) => {
    if (!rootTask) return null

    return (
        <RecordList 
            classNames={['task-list']}
            root={rootTask}
            activeRecordConfig={activeRecordConfig}
            completedRecordConfig={completedRecordConfig}
            titleRecordConfig={titleRecordConfig}
        />
    )
}

export default TaskList
