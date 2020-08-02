import { ITask, IProject } from '../types'

export enum actionTypes {
    SET_ADDED_RECORD_ID = 'SET_ADDED_RECORD_ID',
    SET_PROJECT_TITLE = 'SET_TITLE',
    CREATE_TASK = 'CREATE_TASK',
    UPDATE_TASK = 'UPDATE_TASK',
    DELETE_TASK = 'DELETE_TASK',
    MOVE_TASK = 'MOVE_TASK',
    CREATE_PROJECT = 'CREATE_PROJECT',
    UPDATE_PROJECT = 'UPDATE_PROJECT',
    DELETE_PROJECT = 'DELETE_PROJECT',
    MOVE_PROJECT = 'MOVE_PROJECT'
}

export const setAddedRecordId = (id: number | undefined) => ({
    type: actionTypes.SET_ADDED_RECORD_ID,
    id
}) 

export const setProjectTitleAction = (title: string) => ({
    type: actionTypes.SET_PROJECT_TITLE,
    title
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

export const moveTaskAction = (item: ITask) => ({
    type: actionTypes.MOVE_TASK,
    item
}) 

export const createProjectAction = (item: IProject) => ({
    type: actionTypes.CREATE_PROJECT,
    item
}) 

export const updateProjectAction = (item: IProject) => ({
    type: actionTypes.UPDATE_PROJECT,
    item
}) 

export const deleteProjectAction = (item: IProject) => ({
    type: actionTypes.DELETE_PROJECT,
    item
})

export const moveProjectAction = (item: IProject) => ({
    type: actionTypes.MOVE_PROJECT,
    item
}) 

