import { SyncTargets } from '../classes/Syncer';

const METADATA_KEY = 'metadata'
const SELECTED_PROJECT_ID_KEY = 'selectedProjectId'
const SETTINGS_KEY = 'settings'
const TOKENS_KEY = 'tokens'

export const hasItem = (key: string): boolean => {
    return !!localStorage.getItem(key)
}

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
    localStorage.setItem(SELECTED_PROJECT_ID_KEY, id)
}

export const getSelectedProjectId = (): string => {
    return localStorage.getItem(SELECTED_PROJECT_ID_KEY) || ''
}

const getSettings = (): any => { 
    return getObject(SETTINGS_KEY)   
}

export const getSyncTarget = (): SyncTargets => {
    return getSettings().syncTarget as SyncTargets
}

export const setSyncTarget = (syncTarget: SyncTargets): void => {
    setObject(SETTINGS_KEY, { ...getSettings(), syncTarget })
}

const getTokens = (): any => {
    return getObject(TOKENS_KEY)
}

export const getDropboxToken = (): string => {
    return getTokens().dropboxAccessToken
}

export const setDropboxToken = (dropboxAccessToken: string): void => {
    setObject(TOKENS_KEY, { ...getTokens(), dropboxAccessToken })
}

export const getMetadada = (): any => {
    return getObject(METADATA_KEY)
}

export const setMetadada = (metadata: any) => {
    setObject(METADATA_KEY, metadata)
}

export const hasMetadata = (): boolean => {
    return hasItem(METADATA_KEY)
}
