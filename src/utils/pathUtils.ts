import { Task } from "../types"

const PATH_SEPARATOR = '.' 

export const initPaths = (root: any) => {
    root.path = '0'
    return initPathsRecursively(root)
}

export const constructNewPath = (root: Task) => {
    const { path, tasks } = root
    return tasks.length 
        ? addToPath(path, tasks
            .map((t) => parseInt(pathToArray(t.path).reverse()[0]))
            .reduce((prev, curr) => Math.max(prev, curr)) + 1)
        : addToPath(path, '0')
}

export const isTopLevelItem = (item: Task): boolean => 
    pathToArray(item.path).length === 2

export const pathToArray = (path: string) => 
    path.split(PATH_SEPARATOR)

export const addToPath = (path: string, addition: string | number) =>
    path + PATH_SEPARATOR + addition

const initPathsRecursively = (root: any) => {
    root.tasks.forEach((item: any, index: number) => {
        item.path = addToPath(root.path, index)
        initPathsRecursively(item)
    })
    return root
}