import { Task } from './../types';
import { pathToArray, addToPath } from '../utils/pathUtils';

export const createItem = (root: Task, createdItem: Task) =>
    updateItemChain(root, createdItem, createArrayItem)

export const updateItem = (root: Task, updatedItem: Task) =>
    updateItemChain(root, updatedItem, updateArrayItem) 

export const deleteItem = (root: Task, deletedItem: Task) =>
    updateItemChain(root, deletedItem, deleteArrayItem)

export const moveItem = (root: Task, movedItemPath: string, siblingPath: string) => {
    const movedItem = getItemByPath(root, movedItemPath)
    return updateItemChain(root, movedItem, 
        (a: Task[], b: Task) => moveArrayItem(a, b, siblingPath))
}

const createArrayItem = (array: Task[], createdItem: Task) =>
    array.concat(createdItem)

const updateArrayItem = (array: Task[], updatedItem: Task) => 
    array.map(item => item.path !== updatedItem.path ? item : updatedItem)

const deleteArrayItem = (array: Task[], deletedItem: Task) => 
    array.filter(item => item.path !== deletedItem.path)

const moveArrayItem = (array: Task[], movedItem: Task, siblingPath: string) => {
    const newArray = array.filter((it: Task) => it !== movedItem)
    const movedItemNewIndex = siblingPath
        ? newArray.findIndex((it: Task) => it.path === siblingPath) + 1
        : 0
    newArray.splice(movedItemNewIndex, 0, movedItem!)
    return newArray
}

const updateItemChain = (
    root: Task, updatedItem: Task, 
    whatToDo: (array: Task[], task: Task) => Task[]
) => {
    return updateChain(getItemChain(root, updatedItem), whatToDo)
}

const updateChain = (
    chain: Task[], 
    whatToDo: (array: Task[], task: Task) => Task[]
) => {
    return chain.length === 1
        ? { ...chain[0] }
        : chain.reduce((prev: Task, curr: Task, index: number) => ({
            ...curr,
            tasks: index === 1
                ? whatToDo(curr.tasks, prev)
                : updateArrayItem(curr.tasks, prev)
        }))
}

const getItemByPath = (root: Task, path: string) => {
    let item = root
    pathToArray(path).forEach((path: string, index: number) => {
        item = index === 0 
            ? item 
            : item.tasks.find(it => it.path === addToPath(item.path, path))!
    })
    return item
}

const getItemChain = (root: Task, updatedItem: Task): Task[] => {
    if (root.path === updatedItem.path) return [ updatedItem ]
    const pathArr = pathToArray(updatedItem.path)
    return pathArr.map((path: string, index: number) => {
        if (index === 0) return root 
        if (index === pathArr.length - 1) return updatedItem
        return root = root.tasks.find(it => it.path === addToPath(root.path, path))!
    }).reverse()
}
