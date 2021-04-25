import Task from "../classes/Task"
import * as lsUtils from "./localStorageUtils"
import metadata, { ROOT_ID } from '../classes/Metadata'
import { store } from '../classes/Store' 

export const initRoot = () => {
    if (hasRoot()) return
    const root = { 
        id: '0', 
        text: "Projects" 
    }
    createTask(new Task(root))
}

export const hasRoot = (): boolean => {
    return lsUtils.hasItem(ROOT_ID)
}

export const getRoot = () => {
    return getTask(ROOT_ID)
}

export const getTask = (taskId: string): Task => {
    return lsUtils.getObject(taskId)
}

export const getTaskList = (taskIds: string[]): Task[] => {
    return taskIds.reduce((acc: Task[], curr) => {
        acc.push(getTask(curr))
        return acc
    }, [])
}

export const getAllTasks = (): Task[] => {
    return getTaskList(metadata.getAllTaskIds())
}

export const getSubTasksList = (parentId: string): Task[] => {
    const childrenIds = metadata.getChildrenIds(parentId)
    return getTaskList(childrenIds)
}

export const getProjectsList = (): Task[] => {
    const childrenIds = metadata.getChildrenIds(ROOT_ID)
    return getTaskList(childrenIds)
}

export const getTasksTree = () => {
    const addSubTasks = (parent: Task) => {
        parent.subTasks = getSubTasksList(parent.id)
        parent.subTasks.forEach((task) => addSubTasks(task))
    }
    const root = getRoot()
    addSubTasks(root)
    return root
}

export const updateTask = (task: Task): void => {
    task.updatedAt = Date.now()
    lsUtils.setObject(task.id, task)
    metadata.registerUpdated(task)
}

export const createTask = (task: Task): void => {
    if (!task.updatedAt) task.updatedAt = Date.now()
    lsUtils.setObject(task.id, task)
    metadata.registerCreated(task)
}

export const createTasks = (tasks: Task[]): void => {
    tasks.forEach((task) => createTask(task))
}

export const deleteTask = (taskId: string): void => {
    if (metadata.isProject(taskId) && store.selectedProjectId === taskId) {
        store.selectedProjectId = ''
        lsUtils.setSelectedProjectId('')
    }
    lsUtils.removeItem(taskId)
    metadata.registerDeleted(taskId)
    metadata.getChildrenIds(taskId).forEach((id) => deleteTask(id))
}

export const deleteTasks = (taskIds: string[]): void => {
    taskIds.forEach((id) => deleteTask(id))
}
