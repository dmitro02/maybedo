import RecordList from './RecordList'
import { Task } from '../../types'

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
            />
            : null   
    )
}

export default SubTaskList