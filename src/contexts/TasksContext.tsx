import React, { 
    createContext, 
    useReducer, 
    useContext 
} from "react"
import { ITask } from '../types'
import { 
    createItem,
    updateItem,
    deleteItem,
    moveItem
} from './contextUtils'
import { actionTypes } from '../contexts/actionCreators'
import DATA from '../data'

export interface IStore {
    rootProject: ITask
    addedItemPath: string | undefined
    currentProjectPath: string
}

const getInitialState = (): IStore => ({
    ...DATA,
    addedItemPath: undefined,
    currentProjectPath: '0:1'
})

const TasksContext = createContext<any>(undefined)

export function TasksContextProvider({ children }: any) {
    const context = useReducer(tasksReducer, getInitialState())
    return (
      <TasksContext.Provider value={context}>
          {children}
      </TasksContext.Provider>
    )
  }

export const useTasksContext = () => useContext(TasksContext)

const tasksReducer = (state: IStore, action: any): IStore => {    
    switch (action.type) {
        case actionTypes.SET_CURRENT_PROJECT_ID: {
            return {
                ...state,
                currentProjectPath: action.item.path
            }
        }
        case actionTypes.CREATE_TASK: {
            const { item } = action 
            return {
                ...createItem(state, item),
                addedItemPath: item.path
            }
        }
        case actionTypes.UPDATE_TASK: {
            return updateItem(state, action.item)
        }
        case actionTypes.DELETE_TASK: {
            return deleteItem(state, action.item)
        }
        case actionTypes.MOVE_TASK: {
            const { movedItemPath, siblingPath } = action
            return moveItem(state, movedItemPath, siblingPath)
        }
        default:
            return state;
    }
};

export const createTaskObj = (
    path: string,
    text: string = '', 
    isDone: boolean = false, 
): ITask => ({ 
    path, 
    text, 
    isDone, 
    tasks: []
})
