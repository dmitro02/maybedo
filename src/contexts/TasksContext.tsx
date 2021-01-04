import React, { 
    createContext, 
    useReducer, 
    useContext 
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
import { validateExportedData } from "../utils/persistDataUtils"

export interface IStore {
    rootProject: Task
    addedItemPath?: string
    modal?: IModal
    banner?: IBanner
    showSidebar?: boolean
}

const getInitialAppData = () => {
    const lsData = JSON.parse(localStorage.getItem('data')!)
    if (validateExportedData(lsData)) {
        return lsData.tasklist
    } else {
        return DATA
    }
}

const getInitialState = (data: any): IStore => {
    const rootProject: Task = initPaths(data)
    rootProject.selectedSubTaskPath = rootProject.tasks[0].path
    return { rootProject }
}

const TasksContext = createContext<any>(undefined)

export function TasksContextProvider({ children }: any) {
    const context = useReducer(tasksReducer, getInitialState(getInitialAppData()))
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
            const { item } = action 
            return {
                ...state,
                rootProject: createItem(state.rootProject, item),
                addedItemPath: item.path
            }
        }
        case actionTypes.UPDATE_TASK: {
            return {
                ...state,
                rootProject: updateItem(state.rootProject, action.item)
            }
        }
        case actionTypes.DELETE_TASK: {
            return {
                ...state,
                rootProject: deleteItem(state.rootProject, action.item)
            }
        }
        case actionTypes.MOVE_TASK: {
            const { movedItemPath, siblingPath } = action
            return {
                ...state,
                rootProject: moveItem(state.rootProject, movedItemPath, siblingPath)
            }
        }
        case actionTypes.SET_APP_DATA: {
            return getInitialState(action.rootProject)
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
        default:
            return state;
    }
};
