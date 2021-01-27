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
    createActions, 
    actionTypes 
} from '../contexts/actionCreators'
import LsConnector from "../utils/LsConnector"
import * as tree from '../utils/TaskTree'

const initialState: IStore = {
    taskList: tree.getLinkedTree(new Task('Projects', null))
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
        case actionTypes.CASCADING_UPDATE: {
            return {
                ...state,
                updatedAt: Date.now(),
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
        case actionTypes.SET_SYNC_STATUS: {
            return { ...state, syncStatus: action.status }
        }
        case actionTypes.SAVE_TO_LS: {
            const { updatedAt = 0, taskList } = state
            LsConnector.saveToLocalStorage(updatedAt, taskList)
            return state
        }
        default:
            return state
    }
};
