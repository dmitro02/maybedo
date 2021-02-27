import { Task } from '../../types'
import RecordList from './RecordList'
import taskStore from '../../utils/Store'
import { useTaskStoreWithForceUpdate } from '../../utils/customHooks'

const TaskList = () => {

    const root = taskStore.taskList

    useTaskStoreWithForceUpdate(root.id)

    // select project to display
    const projects = root.tasks
    const selectedProject = projects.length 
        ? projects.find((task: Task) => task.id === root.selectedSubTaskId) || projects[0]
        : null
    if (!root.selectedSubTaskId && selectedProject) {
        root.selectedSubTaskId = selectedProject.id
    }

    if (!selectedProject) return null

    return (
        <RecordList 
            classNames={['task-list']}
            root={selectedProject}
            hasTitle
        />
    )
}

export default TaskList
