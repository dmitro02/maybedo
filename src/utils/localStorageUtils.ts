import { SyncTargets } from '../classes/Syncer'

const getObject = (key: string): any => {
    return JSON.parse(localStorage.getItem(key) || '{}')
}

const setObject = (key: string, obj: any): void => {
    localStorage.setItem(key, JSON.stringify(obj))
}

const getMetadata = (): any => { 
    return getObject('metadata')   
}

export const getUpdatedAt = (): number => {
    const value = getMetadata().updatedAt
    return value ? parseInt(value) : 0
}

export const setUpdatedAt = (updatedAt: number): void => {
    setObject('metadata', { ...getMetadata(), updatedAt: updatedAt.toString() })
}

const getSettings = (): any => { 
    return getObject('settings')   
}

export const getSyncTarget = (): SyncTargets => {
    return getSettings().syncTarget as SyncTargets
}

export const setSyncTarget = (syncTarget: SyncTargets): void => {
    setObject('settings', { ...getSettings(), syncTarget })
}

const getTokens = (): any => {
    return getObject('tokens')
}

export const getDropboxToken = (): string => {
    return getTokens().dropboxAccessToken
}

export const setDropboxToken = (dropboxAccessToken: string): void => {
    setObject('tokens', { ...getTokens(), dropboxAccessToken })
}

export const getLsTaskList = (): string | null => {
    const item = localStorage.getItem('taskList')
    return (item && item !== '=> {}') ? item : null
}

export const setLsTaskList = (taskList: string): void => {
    localStorage.setItem('taskList', taskList)
}

export const saveToLocalStorage = (updatedAt: number, taskList: string | null): void => {
    if (!taskList) return
    setUpdatedAt(updatedAt)
    setLsTaskList(taskList)
}
