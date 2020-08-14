import { IStore } from './TasksContext';
import { ITask } from './../types';

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

export const initPath = (root: ITask): ITask => {
    root.tasks.forEach((item: ITask, index: number) => {
        item.path = root.path + ':' + index
        initPath(item)
    })
    return root
}

const getItemByPath = (root: ITask, path: string) => {
    const pathArr = path.split(':')
    let item = root
    for (let i = 1; i < pathArr.length; i++) {
        const currPath = item.path + ':' + pathArr[i]
        item = item.tasks.find(it => it.path === currPath)!
    }
    return item
}

const getItemChain = (root: ITask, updateByItem: ITask) => {
    const pathArr = updateByItem.path.split(':')
    let item = root
    const itemChain = [item]
    for (let i = 1; i < pathArr.length - 1; i++) {
        const currPath = item.path + ':' + pathArr[i]
        item = item.tasks.find(it => it.path === currPath)!
        itemChain.unshift(item)
    }
    itemChain.unshift(updateByItem)
    return itemChain
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
    for (let i = 0; i < itemChain.length - 1; i++) {
        itemChain[i + 1] = {
            ...itemChain[i + 1],
            tasks: i === 0
                ? whatToDo(itemChain[i + 1].tasks, itemChain[i])
                : updateArrayItem(itemChain[i + 1].tasks, itemChain[i])
        } 
    }
    return {
        ...state,
        rootProject: itemChain[itemChain.length - 1]
    }
}
