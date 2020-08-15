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
    for (let i = 1; i < pathArr.length; i++) {
        const currPath = item.path + PATH_SEPARATOR + pathArr[i]
        item = item.tasks.find(it => it.path === currPath)!
    }
    return item
}

const getItemChain = (root: ITask, updateByItem: ITask) => {
    const pathArr = updateByItem.path.split(PATH_SEPARATOR)
    let item = root
    const itemChain = [item]
    for (let i = 1; i < pathArr.length - 1; i++) {
        const currPath = item.path + PATH_SEPARATOR + pathArr[i]
        item = item.tasks.find(it => it.path === currPath)!
        itemChain.unshift(item)
    }
    itemChain.unshift(updateByItem)
    return itemChain
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

export const isTopLevelItem = 
    (item: ITask) => item.path.split(PATH_SEPARATOR).length === 2