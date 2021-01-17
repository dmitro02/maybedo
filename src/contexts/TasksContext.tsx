import React, { 
    createContext, 
    useContext, 
    useReducer
} from "react"
import { 
    IContext, 
    IStore, 
    Task } from '../types'
import { 
    createItem,
    updateItem,
    deleteItem,
    moveItem
} from './contextUtils'
import { 
    createActions, 
    actionTypes 
} from '../contexts/actionCreators'
import LsConnector from "../utils/LsConnector"

const initialState: IStore = {
    taskList: new Task('0', 'Projects')
}

const TasksContext = createContext<any>(undefined)

export function TasksContextProvider({ children }: any) {
    const [ store, dispatch ] = useReducer(tasksReducer, initialState)

    const context: IContext = {
        store,
        actions: createActions(dispatch)
    }

    return (
      <TasksContext.Provider value={context}>
          {children}
      </TasksContext.Provider>
    )
  }

export const useTasksContext = (): IContext => useContext(TasksContext)

const tasksReducer = (state: IStore, action: any): IStore => {    
    switch (action.type) {
        case actionTypes.CREATE_TASK: {
            const { item } = action 
            return {
                ...state,
                updatedAt: Date.now(),
                taskList: createItem(state.taskList, item),
                addedItemPath: item.path
            }
        }
        case actionTypes.UPDATE_TASK: {
            return {
                ...state,
                updatedAt: Date.now(),
                taskList: updateItem(state.taskList, action.item)
            }
        }
        case actionTypes.SELECT_TASK: {
            return {
                ...state,
                taskList: updateItem(state.taskList, action.parentItem)
            }
        }
        case actionTypes.DELETE_TASK: {
            return {
                ...state,
                updatedAt: Date.now(),
                taskList: deleteItem(state.taskList, action.item)
            }
        }
        case actionTypes.MOVE_TASK: {
            const { movedItemPath, siblingPath } = action
            return {
                ...state,
                updatedAt: Date.now(),
                taskList: moveItem(state.taskList, movedItemPath, siblingPath)
            }
        }
        case actionTypes.SET_APP_DATA: {
            return { ...action.state }
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
            const { updatedAt = 0, taskList } = state

            if (taskList) {
                LsConnector.saveToLocalStorage(updatedAt, taskList)
            }
            return state
        }
        default:
            return state
    }
};
