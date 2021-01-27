import { Task } from "../types"

export const getLinkedTree = (rootTask: any): Task => {
    linkTasks(rootTask, null)
    return rootTask
}

export const createTask = (newTask: Task): void => {
    const { parent } = newTask
    parent!.tasks.push(newTask)
}

export const deleteTask = (deletedTask: Task): void => {
    const { parent } = deletedTask
    parent!.tasks = parent!.tasks.filter((it) => it !== deletedTask)
}

export const selectTask = (selectedTask: Task): void => {
    const { parent } = selectedTask
    parent!.selectedSubTaskId = selectedTask.id
}

const linkTasks = (task: Task, parentTask: Task | null): void => {
    task.parent = parentTask
    if (task.tasks) {
        task.tasks.forEach((childTask: Task) => linkTasks(childTask, task))
    }    
}

export const toJSON = (taskList: Task) => {
    const excludeKeys = [
        // TODO: remove path when no longer exists
        'path',
        'parent'
    ]
    const replacer = (key: string, value: any) =>
        excludeKeys.includes(key) ? undefined : value

    return JSON.stringify(taskList, replacer, 2)
}
