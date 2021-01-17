import { Task } from "../types"

const PATH_SEPARATOR = '.' 

export const initPaths = (taskList: Task) => {
    taskList.path = '0'
    if (taskList.tasks.length > 0) {
        taskList.selectedSubTaskPath = '0.0'
    }
    return initPathsRecursively(taskList)
}

export const constructNewPath = (taskList: Task) => {
    const { path, tasks } = taskList
    return tasks.length 
        ? addToPath(path, tasks
            .map((t) => parseInt(pathToArray(t.path).reverse()[0]))
            .reduce((prev, curr) => Math.max(prev, curr)) + 1)
        : addToPath(path, '0')
}

export const isProjectLevelItem = (item: Task): boolean => 
    pathToArray(item.path).length === 2

export const isTaskLevelItem = (item: Task): boolean => 
    pathToArray(item.path).length > 2

export const pathToArray = (path: string) => 
    path.split(PATH_SEPARATOR)

export const addToPath = (path: string, addition: string | number) =>
    path + PATH_SEPARATOR + addition

const initPathsRecursively = (taskList: any) => {
    if (!Array.isArray(taskList.tasks)) taskList.tasks = []
    taskList.tasks.forEach((item: any, index: number) => {
        item.path = addToPath(taskList.path, index)
        initPathsRecursively(item)
    })
    return taskList
}