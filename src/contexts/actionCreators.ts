import { ITask, IProject } from '../types'

export enum actionTypes {
    SET_TITLE = 'SET_TITLE',
    CHANGE_TASK = 'CHANGE_TASK',
    ADD_TASK = 'ADD_TASK',
    DELETE_TASK = 'DELETE_TASK',
    SET_ADDED_TASK = 'SET_ADDED_TASK'
}

export const setTitleAction = (title: string) => ({
    type: actionTypes.SET_TITLE,
    title
}) 

export const changeTaskAction = (task: ITask) => ({
    type: actionTypes.CHANGE_TASK,
    task
}) 

export const addTaskAction = (task: ITask) => ({
    type: actionTypes.ADD_TASK,
    task
}) 

export const deleteTaskAction = (task: ITask) => ({
    type: actionTypes.DELETE_TASK,
    task
}) 

export const setAddedTaskId = (value: number | undefined) => ({
    type: actionTypes.SET_ADDED_TASK,
    value
}) 