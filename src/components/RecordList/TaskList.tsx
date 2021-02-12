import { Task } from '../../types'
import RecordList from './RecordList'

type Props = { rootTask: Task }

const TaskList = ({ rootTask }: Props) => {
    return (
        <RecordList 
            classNames={['task-list']}
            root={rootTask}
            hasTitle
        />
    )
}

export default TaskList
