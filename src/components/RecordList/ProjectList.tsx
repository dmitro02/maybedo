import RecordList from './RecordList'
import { Task } from '../../types'

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
