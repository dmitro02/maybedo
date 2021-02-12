import RecordList from './RecordList'
import { Task } from '../../types'

type Props = { task: Task }

const SubTaskList = ({ task }: Props) => {
    return (
        <RecordList 
            classNames={['subtasks-list']}
            root={task}
        />
    )
}

export default SubTaskList