import { SyncTargets } from '../classes/Syncer';

export const saveToLocalStorage = (updatedAt: number, taskList: string | null): void => {
    if (!taskList) return
    setLsUpdatedAt(updatedAt)
    setLsTaskList(taskList)
}

export const getLsUpdatedAt = (): number => {
    const item = localStorage.getItem('updatedAt')
    return item ? parseInt(item) : 0
}

export const setLsUpdatedAt = (updatedAt: number): void => {
    localStorage.setItem('updatedAt', updatedAt.toString())
}

export const getLsTaskList = (): string | null => {
    const item = localStorage.getItem('taskList')
    return (item && item !== '=> {}') ? item : null
}

export const setLsTaskList = (taskList: string): void => {
    localStorage.setItem('taskList', taskList)
}

export const getSyncTarget = (): SyncTargets => {
    return localStorage.getItem('syncTarget') as SyncTargets
}

export const setSyncTarget = (syncTarget: SyncTargets): void => {
    localStorage.setItem('syncTarget', syncTarget)
}
