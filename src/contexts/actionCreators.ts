import { SyncStatuses } from './../components/Statuses/SyncStatus';
import { 
    IBanner, 
    IModal, 
    IStore, 
    Task,
    IActions
} from '../types'

export const createActions = (dispatch: Function): IActions => ({
    setAppData: (state: IStore) => dispatch(setAppData(state)),
    setModal: (modal: IModal | null) => dispatch(setModal(modal)),
    setBanner: (banner: IBanner | null) => dispatch(setBanner(banner)),
    setShowSidebar: (value: boolean) => dispatch(setShowSidebar(value)),
    setLoading: (value: boolean) => dispatch(setLoading(value)),
    setSyncStatus: (status: SyncStatuses) => dispatch(setSyncStatus(status)),
    saveToLocalStorage: () => dispatch(saveToLocalStorage()),
    cascadingUpdate: () => dispatch(cascadingUpdateAction()) 
})

export enum actionTypes {
    SET_APP_DATA = 'SET_APP_DATA',
    SET_MODAL = 'SET_MODAL',
    SET_BANNER = 'SET_BANNER',
    SET_SHOW_SIDEBAR = 'SET_SHOW_SIDEBAR',
    SET_LOADING = 'SET_LOADING',
    SET_SYNC_STATUS = 'SET_SYNC_STATUS',
    SELECT_TASK = 'SELECT_TASK',
    SAVE_TO_LS = 'SAVE_TO_LS',
    CASCADING_UPDATE = 'CASCADING_UPDATE'
}

export const cascadingUpdateAction = () => ({
    type: actionTypes.CASCADING_UPDATE,
}) 

export const selectTaskAction = (item: Task) => ({
    type: actionTypes.SELECT_TASK,
    item
})

export const setAppData = (state: IStore) => ({
    type: actionTypes.SET_APP_DATA,
    state
})

export const setModal = (modal: IModal | null) => ({
    type: actionTypes.SET_MODAL,
    modal
})

export const setBanner = (banner: IBanner | null) => ({
    type: actionTypes.SET_BANNER,
    banner
})

export const setShowSidebar = (value: boolean) => ({
    type: actionTypes.SET_SHOW_SIDEBAR,
    value
})

export const setLoading = (value: boolean) => ({
    type: actionTypes.SET_LOADING,
    value
})

export const setSyncStatus = (status: SyncStatuses) => ({
    type: actionTypes.SET_SYNC_STATUS,
    status
})

export const saveToLocalStorage = () => ({
    type: actionTypes.SAVE_TO_LS
})
