import { createStore } from './StoreFactory';
import * as ls from "../services/localStorageService"
import { getProjectsList, initRoot } from '../services/taskService'
import metadata from './Metadata'
import { SyncStatuses } from '../components/Statuses/SyncStatus'
import { IBanner } from '../components/Banner/Banner'

metadata.init()
initRoot()

type Store = {
    selectedProjectId: string,
    showLoading: boolean,
    banner: IBanner | null,
    syncStatus: SyncStatuses
}

export const initSelectProjectId = () => (
    ls.getSelectedProjectId()
        || getProjectsList()[0]?.id 
        || ''
)

const initialValue: Store = {
    selectedProjectId: initSelectProjectId(),
    showLoading: false,
    banner: null,
    syncStatus: SyncStatuses.NotConfigured
}

export const {
    store,
    notify,
    useEvent,
    usePropertyWithState,
    useReload,
    reload
} = createStore(initialValue)

export enum Events {
    SetTitleByProject,
    SetProjectByTitle,
    DeleteCompleted,
} 
