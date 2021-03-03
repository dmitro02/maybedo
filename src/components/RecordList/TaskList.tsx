import Task from '../../classes/Task'
import RecordList from './RecordList'
import taskStore, { useSubscribeWithForceUpdate } from '../../classes/Store'

const TaskList = () => {

    const root = taskStore.taskList

    useSubscribeWithForceUpdate(root.id)

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
