import { IStore } from './TasksContext';
import { ITask } from './../types';
import { pathToArray, addToPath } from '../utils/pathUtils';

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
    return chain.length === 1
        ? { ...chain[0] }
        : chain.reduce((prev: ITask, curr: ITask, index: number) => ({
            ...curr,
            tasks: index === 1
                ? whatToDo(curr.tasks, prev)
                : updateArrayItem(curr.tasks, prev)
        }))
}

const getItemByPath = (root: ITask, path: string) => {
    let item = root
    pathToArray(path).forEach((path: string, index: number) => {
        item = index === 0 
            ? item 
            : item.tasks.find(it => it.path === addToPath(item.path, path))!
    })
    return item
}

const getItemChain = (root: ITask, updatedItem: ITask): ITask[] => {
    const pathArr = pathToArray(updatedItem.path)
    return pathArr.map((path: string, index: number) => {
        if (index === 0) return root 
        if (index === pathArr.length - 1) return updatedItem
        return root = root.tasks.find(it => it.path === addToPath(root.path, path))!
    }).reverse()
}
