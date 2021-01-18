import { SyncStatuses } from './../components/Statuses/SyncStatus';
import { 
    IBanner, 
    IModal, 
    IStore, 
    Task,
    IActions
} from '../types'
// import { SyncTargets } from '../utils/Syncer';

export const createActions = (dispatch: Function): IActions => ({
    setAppData: (state: IStore) => dispatch(setAppData(state)),
    createTaskAction: (item: Task) => dispatch(createTaskAction(item)),
    updateTaskAction: (item: Task) => dispatch(updateTaskAction(item)),
    deleteTaskAction: (item: Task) => dispatch(deleteTaskAction(item)),
    selectTaskAction: (parentItem: Task) => dispatch(selectTaskAction(parentItem)),
    setModal: (modal: IModal | null) => dispatch(setModal(modal)),
    setBanner: (banner: IBanner | null) => dispatch(setBanner(banner)),
    setShowSidebar: (value: boolean) => dispatch(setShowSidebar(value)),
    setLoading: (value: boolean) => dispatch(setLoading(value)),
    setSyncStatus: (status: SyncStatuses) => dispatch(setSyncStatus(status)),
    // setSyncTarget: (target: SyncTargets) => dispatch(setSyncTarget(target)),
    saveToLocalStorage: () => dispatch(saveToLocalStorage()),
    moveTaskAction: (movedItemPath: string, siblingPath: string | null) => 
        dispatch(moveTaskAction(movedItemPath, siblingPath)),
})

export enum actionTypes {
    CREATE_TASK = 'CREATE_TASK',
    UPDATE_TASK = 'UPDATE_TASK',
    DELETE_TASK = 'DELETE_TASK',
    MOVE_TASK = 'MOVE_TASK',
    SET_APP_DATA = 'SET_APP_DATA',
    SET_MODAL = 'SET_MODAL',
    SET_BANNER = 'SET_BANNER',
    SET_SHOW_SIDEBAR = 'SET_SHOW_SIDEBAR',
    SET_LOADING = 'SET_LOADING',
    SET_SYNC_STATUS = 'SET_SYNC_STATUS',
    // SET_SYNC_TARGET = 'SET_SYNC_TARGET',
    SELECT_TASK = 'SELECT_TASK',
    SAVE_TO_LS = 'SAVE_TO_LS',
}

export const createTaskAction = (item: Task) => ({
    type: actionTypes.CREATE_TASK,
    item
}) 

export const updateTaskAction = (item: Task) => ({
    type: actionTypes.UPDATE_TASK,
    item
}) 

export const deleteTaskAction = (item: Task) => ({
    type: actionTypes.DELETE_TASK,
    item
})

export const moveTaskAction = (movedItemPath: string, siblingPath: string | null) => ({
    type: actionTypes.MOVE_TASK,
    movedItemPath,
    siblingPath
}) 

export const selectTaskAction = (parentItem: Task) => ({
    type: actionTypes.SELECT_TASK,
    parentItem
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

// export const setSyncTarget = (target: SyncTargets) => ({
//     type: actionTypes.SET_SYNC_TARGET,
//     target
// })

export const saveToLocalStorage = () => ({
    type: actionTypes.SAVE_TO_LS
})
