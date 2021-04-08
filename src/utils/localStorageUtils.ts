import { Metadata, SyncTargets } from '../classes/Syncer';
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

export const getMetadata = (): any => { 
    return getObject('metadata')   
}

export const setMetadata = (metadata: Metadata): void => {   
    setObject('metadata', metadata) 
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

export const init = () => {
    const initial = { 
        id: '0', 
        text: "Projects", 
        isProject: true 
    }
    const root = new Task(initial)
    setMetadata(new Metadata())
    setObject(root.id, root)
}

export const populateData = (flatData: any) => {
    init()
    Object.entries(flatData).forEach((entry: any) => {
        const task = entry[1]
        task.updatedAt = Date.now()
        setObject(entry[0], task)
    })
}
