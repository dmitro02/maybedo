import RecordList from './RecordList'
import Task from '../../classes/Task'

type Props = { rootTask: Task }

const ProjectList = ({ rootTask }: Props ) => {
    return (
        <RecordList 
            classNames={['project-list']}
            root={rootTask}
            hasTitle
            isEditable={false}
        />
    )
}

export default ProjectList
