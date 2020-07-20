import React, { 
    createContext, 
    useReducer, 
    useContext 
} from "react"
import { TASKS } from '../tasks'
import { ITask, IFullTasksList } from '../types'

export function TasksContextProvider({ children }: any) {
    const context = useReducer(tasksReducer, getInitialState())
    return (
      <TasksContext.Provider value={context}>
          {children}
      </TasksContext.Provider>
    )
  }

export const useTasksContext = () => useContext(TasksContext)

export const moveTaskAction = (task: ITask) => ({
    type: "MOVE_TASK",
    task
}) 

export const addTaskAction = (task: ITask) => ({
    type: "ADD_TASK",
    task
}) 

const TasksContext = createContext<any>(undefined)

const tasksReducer = (state: IFullTasksList, action: any) => {
  switch (action.type) {
    case "MOVE_TASK": {
        let activeTasks = [...state.activeTasks]
        let completedTasks = [...state.completedTasks]
        const { task, task: { isDone } } = action
        if (isDone) {
            activeTasks = activeTasks.filter(t => t !== task)
            completedTasks.unshift(task)
        } else {
            completedTasks = completedTasks.filter(t => t !== task)
            activeTasks.push(task)
        }
        return { activeTasks, completedTasks }
    }
    case "ADD_TASK": {
        let activeTasks = [...state.activeTasks]
        const { task } = action
        console.log(task)
        activeTasks.push(task)
        return { ...state, activeTasks }
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