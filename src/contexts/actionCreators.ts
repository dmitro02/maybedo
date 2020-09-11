import { Task } from '../types'

export enum actionTypes {
    CREATE_TASK = 'CREATE_TASK',
    UPDATE_TASK = 'UPDATE_TASK',
    DELETE_TASK = 'DELETE_TASK',
    MOVE_TASK = 'MOVE_TASK',
    SET_APP_DATA = 'SET_APP_DATA'
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

export const setAppData = (rootProject: Task) => ({
    type: actionTypes.SET_APP_DATA,
    rootProject
})
