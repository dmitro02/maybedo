import { IStore } from './TasksContext';
import { ITask } from './../types';

export const PATH_SEPARATOR = '.' 

export const createItem = (state: IStore, createdItem: ITask) =>
    updateItemChain(state, createdItem, createArrayItem)

export const updateItem = (state: IStore, updatedItem: ITask) =>
    updateItemChain(state, updatedItem, updateArrayItem) 

export const deleteItem = (state: IStore, deletedItem: ITask) =>
    updateItemChain(state, deletedItem, deleteArrayItem)

export const moveItem = (state: IStore, movedItemPath: string, siblingPath: string) => {
    const movedItem = getItemByPath(state.rootProject, movedItemPath)
    return updateItemChain(state, movedItem, 
        (a: ITask[], b: ITask) => moveArrayItem(a, b, siblingPath))
}

export const initPaths = (root: any) => {
    root.path = '0'
    return initPathsRecursively(root)
}

const createArrayItem = (array: ITask[], createdItem: ITask) =>
    array.concat(createdItem)

const updateArrayItem = (array: ITask[], updatedItem: ITask) => 
    array.map(item => item.path !== updatedItem.path ? item : updatedItem)

const deleteArrayItem = (array: ITask[], deletedItem: ITask) => 
    array.filter(item => item.path !== deletedItem.path)

const moveArrayItem = (array: ITask[], movedItem: ITask, siblingPath: string) => {
    const newArray = array.filter((it: ITask) => it !== movedItem)
    const movedItemNewIndex = siblingPath
        ? newArray.findIndex((it: ITask) => it.path === siblingPath) + 1
        : 0
    newArray.splice(movedItemNewIndex, 0, movedItem!)
    return newArray
}

const updateItemChain = (state: IStore, updatedItem: ITask, whatToDo: Function) => {
    const itemChain = getItemChain(state.rootProject, updatedItem)
    return {
        ...state,
        rootProject: updateChain(itemChain, whatToDo)
    }
}

const updateChain = (chain: ITask[], whatToDo: Function) => {
    return chain.reduce((prev: ITask, curr: ITask, index: number) => ({
        ...curr,
        tasks: index === 1
            ? whatToDo(curr.tasks, prev)
            : updateArrayItem(curr.tasks, prev)
    }))
}

const getItemByPath = (root: ITask, path: string) => {
    const pathArr = path.split(PATH_SEPARATOR)
    let item = root
    pathArr.forEach((path: string, index: number) => {
        item = index === 0 
            ? item 
            : item.tasks.find(it => it.path === item.path + PATH_SEPARATOR + path)!
    })
    return item
}

const getItemChain = (root: ITask, updatedItem: ITask): ITask[] => {
    const pathArr = updatedItem.path.split(PATH_SEPARATOR)
    return pathArr.map((path: string, index: number) => {
        if (index === 0) return root 
        if (index === pathArr.length - 1) return updatedItem
        return root = root.tasks.find(it => it.path === root.path + PATH_SEPARATOR + path)!
    }).reverse()
}

const initPathsRecursively = (root: any) => {
    root.tasks.forEach((item: any, index: number) => {
        item.path = root.path + PATH_SEPARATOR + index
        initPathsRecursively(item)
    })
    return root
}

export const constructNewPath = (root: ITask) => {
    const { path, tasks } = root
    return tasks.length 
        ? path + PATH_SEPARATOR + (tasks
            .map(t => parseInt(t.path.split(PATH_SEPARATOR).reverse()[0]))
            .reduce((prev, curr) => Math.max(prev, curr)) + 1)
        : path + PATH_SEPARATOR + '0'
}

export const isTopLevelItem = (item: ITask) => 
    item.path.split(PATH_SEPARATOR).length === 2
