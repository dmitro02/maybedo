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
import { initPaths } from '../utils/pathUtils'
import { actionTypes } from '../contexts/actionCreators'
import DATA from '../data'

export interface IStore {
    rootProject: ITask
    addedItemPath: string | undefined
}

const getInitialState = (): IStore => {
    const rootProject: ITask = initPaths(DATA)
    rootProject.selectedTaskPath = rootProject.tasks[0].path
    return {
        rootProject,
        addedItemPath: undefined
    }
}

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
