import Task from "../classes/Task"
import * as lsUtils from "./localStorageUtils"

export const getRoot = () => {
    return getTask('0')
}

export const getTask = (taskId: string): Task => {
    const rawObj = lsUtils.getObject(taskId)
    return Object.assign(new Task(), rawObj)
}

export const getTaskList = (taskIds: string[]): Task[] => {
    return taskIds.reduce((acc: Task[], curr) => {
        acc.push(getTask(curr))
        return acc
    }, [])
}

export const updateTask = (task: Task): void => {
    task.updatedAt = Date.now()
    lsUtils.setObject(task.id, task)
}

export const createTask = (task: Task, parent: Task): void => {
    updateTask(task)
    parent.tasks.push(task.id)
    updateTask(parent)
    saveMetadata(task.id, 'created')
}

export const deleteTask = (task: Task, parent: Task): void => {
    lsUtils.removeItem(task.id)
    parent.tasks = parent.tasks.filter((id) => id !== task.id)
    updateTask(parent)
    saveMetadata(task.id, 'deleted')
}

const saveMetadata = (taskId: String, operation: 'created' | 'deleted'): void => {
    const meta = lsUtils.getMetadata()
    meta[operation].push(taskId)
    lsUtils.setMetadata(meta)
}
