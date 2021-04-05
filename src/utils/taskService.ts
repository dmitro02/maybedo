import Task from "../classes/Task"
import * as lsUtils from "./localStorageUtils"

export const getTask = (taskId: string): Task => {
    const rawObj = lsUtils.getObject(taskId)
    return Object.assign(new Task(), rawObj)
}

export const getRoot = () => {
    return getTask('0')
}

export const getTaskList = (taskIds: string[]): Task[] => {
    return taskIds.reduce((acc: Task[], curr) => {
        acc.push(getTask(curr))
        return acc
    }, [])
}

export const updateTask = (task: Task): void => {
    lsUtils.setObject(task.id, task)
    lsUtils.setMetadata(Date.now(), [task.id])
}

export const createTask = (task: Task, parent: Task): void => {
    lsUtils.setObject(task.id, task)
    parent.tasks.push(task.id)
    lsUtils.setObject(parent.id, parent)
    lsUtils.setMetadata(Date.now(), [task.id, parent.id])
}

export const deleteTask = (task: Task, parent: Task): void => {
    lsUtils.removeItem(task.id)
    parent.tasks = parent.tasks.filter((id) => id !== task.id)
    lsUtils.setObject(parent.id, parent)
    lsUtils.setMetadata(Date.now(), [task.id, parent.id])
}
