import { SyncStatuses } from './../components/Statuses/SyncStatus';
import { IActions } from '../types'

export const createActions = (dispatch: Function): IActions => ({
    setSyncStatus: (status: SyncStatuses) => dispatch(setSyncStatus(status)),
})

export enum actionTypes {
    SET_SYNC_STATUS = 'SET_SYNC_STATUS',
}

export const setSyncStatus = (status: SyncStatuses) => ({
    type: actionTypes.SET_SYNC_STATUS,
    status
})
