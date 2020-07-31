import React, { 
    createContext, 
    useReducer, 
    useContext 
} from "react"
import { DB } from '../mockDB'
import { ITask, IProject } from '../types'
import { 
    generateNextId,
    updateObject,
    updateArray
} from '../utils'

interface IStore {
    projects: IProject[]
    addedItemId: number | undefined
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

export const setAddedTaskId = (value: number | undefined) => ({
    type: "SET_ADDED_TASK",
    value
}) 

const tasksReducer = (state: IStore, action: any): IStore => {
  switch (action.type) {
    case "CHANGE_TASK": {
        const { task } = action
        return { 
            ...state, 
            projects: updateProjects(state, 
                (project: IProject) => updateObject(project, 
                    { tasks: updateArray(project.tasks, task.id, () => ({ ...task }))})
            ),
            addedItemId: task.id 
        }
    }
    case "ADD_TASK": {
        const { task } = action
        return { 
            ...state, 
            projects: updateProjects(state,
                (project: IProject) => {
                    task.id = generateNextId(project.tasks)
                    return updateObject(project, { tasks: project.tasks.concat(task) }) 
                }  
            ),
            addedItemId: task.id
        }   
    }
    case "DELETE_TASK": {
        return {
            ...state,
            projects: updateProjects(state,
                (project: IProject) => updateObject(project, 
                    { tasks: project.tasks.filter(task => task !== action.task) }))
        }
    }
    case "SET_TITLE": {
        return {
            ...state,
            projects: updateProjects(state,
                    (project: IProject) => updateObject(project, {text: action.title})) 
        }
    }
    case "SET_ADDED_TASK": {
        return {
            ...state,
            addedItemId: action.value
        }
    }
    default:
        return state;
  }
};

const getInitialState = (): IStore => ({ 
    projects: DB,
    addedItemId: undefined,
    currentProjectId: DB[0].id
})

export const createTaskObj = (
    text: string = '', 
    isDone: boolean = false, 
): ITask => ({id: -1, text, isDone})

const updateProjects = (state: IStore, updateProjectCallback: Function) => 
    updateArray(state.projects, state.currentProjectId, updateProjectCallback)