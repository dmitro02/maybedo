import { ITask } from '../types'

export enum actionTypes {
    SET_ADDED_RECORD_ID = 'SET_ADDED_RECORD_ID',
    SET_CURRENT_PROJECT_ID = 'SET_CURRENT_PROJECT_ID',
    CREATE_TASK = 'CREATE_TASK',
    UPDATE_TASK = 'UPDATE_TASK',
    DELETE_TASK = 'DELETE_TASK',
    MOVE_TASK = 'MOVE_TASK'
}

export const setCurrentProjectIdAction = (item: ITask) => ({
    type: actionTypes.SET_CURRENT_PROJECT_ID,
    item
}) 

export const createTaskAction = (item: ITask) => ({
    type: actionTypes.CREATE_TASK,
    item
}) 

export const updateTaskAction = (item: ITask) => ({
    type: actionTypes.UPDATE_TASK,
    item
}) 

export const deleteTaskAction = (item: ITask) => ({
    type: actionTypes.DELETE_TASK,
    item
})

export const moveTaskAction = (movedItemPath: string, siblingPath: string | null) => ({
    type: actionTypes.MOVE_TASK,
    movedItemPath,
    siblingPath
}) 
