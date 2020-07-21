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
        return { ...state, activeTasks, completedTasks }
    }
    case "ADD_TASK": {
        const activeTasks = [...state.activeTasks]
        const completedTasks = [...state.completedTasks]
        const { task } = action
        task.id = generateNextId([...activeTasks, ...completedTasks])
        activeTasks.push(task)
        return { ...state, activeTasks, editedTaskId: task.id }
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
    return { activeTasks, completedTasks, editedTaskId: undefined }
}

export const createTaskObj = (
    data: string = '', 
    isDone: boolean = false, 
): ITask => ({id: -1, data, isDone})

const generateNextId = (tasks: ITask[]) => tasks
    .map((task) => task.id)
    .reduce((prev, curr) => Math.max(prev, curr)) + 1