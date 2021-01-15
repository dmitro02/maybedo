import React, { 
    createContext, 
    useContext, 
    useReducer
} from "react"
import { IBanner, IModal, Task } from '../types'
import { 
    createItem,
    updateItem,
    deleteItem,
    moveItem
} from './contextUtils'
import { initPaths } from '../utils/pathUtils'
import { actionTypes } from '../contexts/actionCreators'
import DATA from '../data'
import LsConnector from "../utils/LsConnector"

export interface IStore {
    rootProject: Task
    addedItemPath?: string
    modal?: IModal
    banner?: IBanner
    showSidebar?: boolean
    loading?: boolean
    syncing?: boolean
    updatedAt?: number
}

export const getInitialState = (data: any): IStore => {
    return { rootProject: initPaths(data) }
}

const TasksContext = createContext<any>(undefined)

export function TasksContextProvider({ children }: any) {
    const context = useReducer(tasksReducer, getInitialState(DATA))
    return (
      <TasksContext.Provider value={context}>
          {children}
      </TasksContext.Provider>
    )
  }

export const useTasksContext = () => useContext(TasksContext)

const tasksReducer = (state: IStore, action: any): IStore => {    
    switch (action.type) {
        case actionTypes.CREATE_TASK: {
            console.log('CREATE_TASK', state);
            const { item } = action 
            return {
                ...state,
                updatedAt: Date.now(),
                rootProject: createItem(state.rootProject, item),
                addedItemPath: item.path
            }
        }
        case actionTypes.UPDATE_TASK: {
            console.log('UPDATE_TASK', state);
            return {
                ...state,
                updatedAt: Date.now(),
                rootProject: updateItem(state.rootProject, action.item)
            }
        }
        case actionTypes.SELECT_TASK: {
            return {
                ...state,
                rootProject: updateItem(state.rootProject, action.parentItem)
            }
        }
        case actionTypes.DELETE_TASK: {
            return {
                ...state,
                updatedAt: Date.now(),
                rootProject: deleteItem(state.rootProject, action.item)
            }
        }
        case actionTypes.MOVE_TASK: {
            const { movedItemPath, siblingPath } = action
            return {
                ...state,
                updatedAt: Date.now(),
                rootProject: moveItem(state.rootProject, movedItemPath, siblingPath)
            }
        }
        case actionTypes.SET_APP_DATA: {
            return {
                ...state,
                ...action.state
            }
        }
        case actionTypes.SET_MODAL: {
            return { ...state, modal: action.modal }
        }
        case actionTypes.SET_BANNER: {
            return { ...state, banner: action.banner }
        }
        case actionTypes.SET_SHOW_SIDEBAR: {
            return { ...state, showSidebar: action.value }
        }
        case actionTypes.SET_LOADING: {
            return { ...state, loading: action.value }
        }
        case actionTypes.SET_SYNCING: {
            return { ...state, syncing: action.value }
        }
        case actionTypes.SAVE_TO_LS: {
            const { updatedAt = 0, rootProject } = state

            if (rootProject) {
                LsConnector.saveToLocalStorage(updatedAt, rootProject)
            }
            return state
        }
        default:
            return state
    }
};
