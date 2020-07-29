import React, { 
    createContext, 
    useReducer, 
    useContext 
} from "react"
import { DB } from '../mockDB'
import { ITask, IProject } from '../types'

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

export const setTitleAction = (title: string) => ({
    type: "SET_TITLE",
    title
}) 

export const setTaskAction = (task: ITask) => ({
    type: "SET_TASK",
    task
}) 

export const addTaskAction = (task: ITask) => ({
    type: "ADD_TASK",
    task
}) 

export const deleteTaskAction = (task: ITask) => ({
    type: "DELETE_TASK",
    task
}) 

const tasksReducer = (state: IProject, action: any): IProject => {
  switch (action.type) {
    case "SET_TASK": {
        const { task } = action
        const tasks = [ ...state.tasks ]
        const i = tasks.findIndex(t => t.id === task.id)
        tasks[i] = { ...task }
        return { ...state, tasks }
    }
    case "ADD_TASK": {
        const { task } = action
        const tasks = [ ...state.tasks ]        
        task.id = generateNextId(tasks)
        tasks.push(task)
        return { ...state, tasks, justAddedTaskId: task.id }
    }
    case "DELETE_TASK": {
        const { task } = action
        const tasks = [ ...state.tasks ].filter(t => t !== task)
        return { ...state, tasks }
    }
    case "SET_TITLE": {
        const { title } = action
        return { ...state, text: title }
    }
    default:
        return state;
  }
};

const getInitialState = () => DB[0]

export const createTaskObj = (
    text: string = '', 
    isDone: boolean = false, 
): ITask => ({id: -1, text, isDone})

const generateNextId = (tasks: ITask[]) => tasks
    .map((task) => task.id)
    .reduce((prev, curr) => Math.max(prev, curr)) + 1