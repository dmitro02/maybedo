import { SyncStatuses } from './../components/Statuses/SyncStatus';
import { 
    IBanner, 
    IModal,
    IActions
} from '../types'

export const createActions = (dispatch: Function): IActions => ({
    setModal: (modal: IModal | null) => dispatch(setModal(modal)),
    setBanner: (banner: IBanner | null) => dispatch(setBanner(banner)),
    setShowSidebar: (value: boolean) => dispatch(setShowSidebar(value)),
    setLoading: (value: boolean) => dispatch(setLoading(value)),
    setSyncStatus: (status: SyncStatuses) => dispatch(setSyncStatus(status)),
    triggerCascadingUpdate: () => dispatch(triggerCascadingUpdateAction()) 
})

export enum actionTypes {
    SET_MODAL = 'SET_MODAL',
    SET_BANNER = 'SET_BANNER',
    SET_SHOW_SIDEBAR = 'SET_SHOW_SIDEBAR',
    SET_LOADING = 'SET_LOADING',
    SET_SYNC_STATUS = 'SET_SYNC_STATUS',
    TRIGGER_CASCADING_UPDATE = 'TRIGGER_CASCADING_UPDATE'
}

export const triggerCascadingUpdateAction = () => ({
    type: actionTypes.TRIGGER_CASCADING_UPDATE,
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
