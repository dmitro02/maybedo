import './ProjectList.scss'
import RecordList from '../RecordList/RecordList'
import { RecordConfig } from '../Record/Record'
import { Task } from '../../types'

const titleRecordConfig: RecordConfig = { isTitle: true }

type Props = {
    rootTask: Task
}

const ProjectList = ({ rootTask }: Props ) => {
    return (
        <RecordList 
            classNames={['project-list']}
            root={rootTask}
            completedRecordConfig={{}}
            titleRecordConfig={titleRecordConfig}
        />
    )
}

export default ProjectList
