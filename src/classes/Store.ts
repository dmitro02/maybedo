import { createStore } from './StoreFactory';
import * as lsUtils from "../utils/localStorageUtils"
import { getProjectsList, initRoot } from '../utils/taskService'
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
    lsUtils.getSelectedProjectId()
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
