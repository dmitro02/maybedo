import React, { createContext, useReducer } from "react"
import { TASKS } from '../tasks'
import { ITask, IFullTasksList } from '../types'

export const TasksContext = createContext<any>(undefined)

const tasksReducer = (state: IFullTasksList, action: any) => {
  switch (action.type) {
    case "MARK_AS_COMPLETED": {
        const activeTasks = 
            state.activeTasks.filter(task => task !== action.task)
        const completedTasks = [...state.completedTasks]
        completedTasks.unshift(action.task)
        return { activeTasks, completedTasks }
    }
    case "MARK_AS_ACTIVE": {
        const completedTasks = 
            state.completedTasks.filter(task => task !== action.task)
        const activeTasks = [...state.activeTasks]
        activeTasks.push(action.task)
        return { activeTasks, completedTasks }    
    }
    default:
        return state;
  }
};

const getInitialState = () => {
    const activeTasks: ITask[] = []
    const completedTasks: ITask[] = []
    TASKS.forEach(task => {
        task.isDone 
            ? completedTasks.push(task)
            : activeTasks.push(task)
    })
    return { activeTasks, completedTasks }
}

export function TasksContextProvider({ children }: any) {
  const context = useReducer(tasksReducer, getInitialState())
  return (
    <TasksContext.Provider value={context}>
        {children}
    </TasksContext.Provider>
  )
}