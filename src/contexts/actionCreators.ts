import { ITask, IProject } from '../types'

export enum actionTypes {
    SET_ADDED_RECORD_ID = 'SET_ADDED_RECORD_ID',
    SET_CURRENT_PROJECT_ID = 'SET_CURRENT_PROJECT_ID',
    SET_PROJECT_TITLE = 'SET_TITLE',
    CREATE_TASK = 'CREATE_TASK',
    UPDATE_TASK = 'UPDATE_TASK',
    DELETE_TASK = 'DELETE_TASK',
    UPDATE_TASKS = 'MOVE_TASK',
    CREATE_PROJECT = 'CREATE_PROJECT',
    UPDATE_PROJECT = 'UPDATE_PROJECT',
    DELETE_PROJECT = 'DELETE_PROJECT',
    UPDATE_PROJECTS = 'UPDATE_PROJECTS'
}

export const setProjectTitleAction = (title: string) => ({
    type: actionTypes.SET_PROJECT_TITLE,
    title
}) 

export const setCurrentProjectIdAction = (item: IProject) => ({
    type: actionTypes.SET_CURRENT_PROJECT_ID,
    item
}) 

export const createTaskAction = (item: ITask, listName: string) => ({
    type: actionTypes.CREATE_TASK,
    item,
    listName
}) 

export const updateTaskAction = (item: ITask) => ({
    type: actionTypes.UPDATE_TASK,
    item
}) 

export const deleteTaskAction = (item: ITask) => ({
    type: actionTypes.DELETE_TASK,
    item
})

export const updateTasksAction = (items: ITask[]) => ({
    type: actionTypes.UPDATE_TASKS,
    items
}) 

export const createProjectAction = (item: IProject, listName: string) => ({
    type: actionTypes.CREATE_PROJECT,
    item,
    listName
}) 

export const updateProjectAction = (item: IProject) => ({
    type: actionTypes.UPDATE_PROJECT,
    item
}) 

export const deleteProjectAction = (item: IProject) => ({
    type: actionTypes.DELETE_PROJECT,
    item
})

export const updateProjectsAction = (items: IProject[]) => ({
    type: actionTypes.UPDATE_PROJECTS,
    items
}) 

