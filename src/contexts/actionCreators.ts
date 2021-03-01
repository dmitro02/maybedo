import { SyncStatuses } from './../components/Statuses/SyncStatus';
import { IBanner, IActions } from '../types'

export const createActions = (dispatch: Function): IActions => ({
    setBanner: (banner: IBanner | null) => dispatch(setBanner(banner)),
    setSyncStatus: (status: SyncStatuses) => dispatch(setSyncStatus(status)),
})

export enum actionTypes {
    SET_BANNER = 'SET_BANNER',
    SET_SYNC_STATUS = 'SET_SYNC_STATUS',
}

export const setBanner = (banner: IBanner | null) => ({
    type: actionTypes.SET_BANNER,
    banner
})

export const setSyncStatus = (status: SyncStatuses) => ({
    type: actionTypes.SET_SYNC_STATUS,
    status
})
