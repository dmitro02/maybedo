import React, { 
    createContext, 
    useReducer, 
    useContext 
} from "react"
import { DB } from '../mockDB'
import { ITask, IProject } from '../types'

interface IStore {
    projects: IProject[]
    justAddedItemId: number | undefined
    currentProjectId: number
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

export const setTitleAction = (title: string) => ({
    type: "SET_TITLE",
    title
}) 

export const changeTaskAction = (task: ITask) => ({
    type: "CHANGE_TASK",
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

const tasksReducer = (state: IStore, action: any): IStore => {
  switch (action.type) {
    case "CHANGE_TASK": {
        console.log("CHANGE_TASK")
        const project = state.projects.find((p) => p.id === state.currentProjectId)
        if (!project) return state
        const { task } = action
        const i = project.tasks.findIndex(t => t.id === task.id)
        project.tasks[i] = { ...task }
        return { ...state }
    }
    case "ADD_TASK": {
        console.log("ADD_TASK")
        const project = state.projects.find((p) => p.id === state.currentProjectId)
        if (!project) return state
        const { task } = action
        const tasks = [ ...project.tasks ]
        task.id = generateNextId(tasks)
        tasks.push(task)
        project.tasks = tasks
        return { 
            ...state, 
            projects: [ ...state.projects.map((p) => p !== project ? p : { ...project })],  
            justAddedItemId: task.id 
        }
    }
    case "DELETE_TASK": {
        const project = state.projects.find((p) => p.id === state.currentProjectId)
        if (!project) return state
        const { task } = action
        project.tasks = project.tasks.filter(t => t !== task)
        return { ...state }
    }
    case "SET_TITLE": {
        const project = state.projects.find((p) => p.id === state.currentProjectId)
        if (!project) return state
        const { title } = action
        project.text = title
        return { ...state,
            projects: state.projects.map((p) => {
                if (p !== project) {
                    return p
                }
                console.log('EQUAL')
                return { ...project }
            }) 
        }
    }
    default:
        return state;
  }
};

const getInitialState = (): IStore => ({ 
    projects: DB,
    justAddedItemId: undefined,
    currentProjectId: DB[0].id
})

export const createTaskObj = (
    text: string = '', 
    isDone: boolean = false, 
): ITask => ({id: -1, text, isDone})

const generateNextId = (items: any[]) => items
    .map((item) => item.id)
    .reduce((prev, curr) => Math.max(prev, curr)) + 1