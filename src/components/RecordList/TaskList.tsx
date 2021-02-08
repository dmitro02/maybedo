import { Task } from '../../types'
import RecordList from './RecordList'

type Props = { rootTask: Task | null }

const TaskList = ({ rootTask }: Props) => {
    if (!rootTask) return null

    return (
        <RecordList 
            classNames={['task-list']}
            root={rootTask}
            hasTitle
        />
    )
}

export default TaskList
