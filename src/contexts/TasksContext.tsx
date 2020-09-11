import React, { 
    createContext, 
    useReducer, 
    useContext 
} from "react"
import { Task } from '../types'
import { 
    createItem,
    updateItem,
    deleteItem,
    moveItem
} from './contextUtils'
import { initPaths } from '../utils/pathUtils'
import { actionTypes } from '../contexts/actionCreators'
import DATA from '../data'

export interface IStore {
    rootProject: Task
    addedItemPath?: string
}

const getInitialState = (data: any): IStore => {
    const rootProject: Task = initPaths(data)
    rootProject.selectedSubTaskPath = rootProject.tasks[0].path
    return { rootProject }
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
        default:
            return state;
    }
};
