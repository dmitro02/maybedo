import { SyncTargets } from '../classes/Syncer'
import Task from '../classes/Task'

export const getObject = (key: string): any => {
    return JSON.parse(localStorage.getItem(key) || '{}')
}

export const setObject = (key: string, obj: any): void => {
    localStorage.setItem(key, JSON.stringify(obj))
}

export const removeItem = (key: string) => {
    localStorage.removeItem(key)
}

const getMetadata = (): any => { 
    return getObject('metadata')   
}

export const setMetadata = (updatedAt: number, updatedIds: string[]): void => {   
    setObject('metadata', { 
        ...getMetadata(),  
        updatedAt,
        ...updatedIds.reduce((acc: any, curr) => (
            { ...acc, [curr]: updatedAt }
        ), {})
    })   
}

export const getUpdatedAt = (): number => {
    const value = getMetadata().updatedAt
    return value ? parseInt(value) : 0
}

export const setUpdatedAt = (updatedAt: number): void => {
    setObject('metadata', { ...getMetadata(), updatedAt })
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

// export const getTaskList = (): string | null => {
//     const item = localStorage.getItem('taskList')
//     return (item && item !== '=> {}') ? item : null
// }

export const setTaskList = (taskList: string): void => {
    localStorage.setItem('taskList', taskList)
}

export const saveToLocalStorage = (updatedAt: number, taskList: string | null): void => {
    if (!taskList) return
    setUpdatedAt(updatedAt)
    setTaskList(taskList)
}

export const init = () => {
    const initial = { 
        id: '0', 
        text: "Projects", 
        isProject: true 
    }
    const root = new Task(initial)
    setMetadata(0, ['0'])
    setObject(root.id, root)
}

export const populateData = (flatData: any) => {
    Object.entries(flatData).forEach((entry: any) => {
        setObject(entry[0], entry[1])
    })
}
