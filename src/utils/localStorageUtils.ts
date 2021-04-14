import { SyncTargets } from '../classes/Syncer';

export const getObject = (key: string): any => {
    return JSON.parse(localStorage.getItem(key) || '{}')
}

export const setObject = (key: string, obj: any): void => {
    localStorage.setItem(key, JSON.stringify(obj))
}

export const removeItem = (key: string) => {
    localStorage.removeItem(key)
}

export const setSelectedProjectId = (id: string): void => {
    localStorage.setItem('selectedProjectId', id)
}

export const getSelectedProjectId = (): string => {
    return localStorage.getItem('selectedProjectId') || ''
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

export const populateData = (flatData: any) => {
    Object.entries(flatData).forEach((entry: any) => {
        const task = entry[1]
        task.updatedAt = Date.now()
        setObject(entry[0], task)
    })
}
