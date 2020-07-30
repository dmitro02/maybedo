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
        const { task } = action
        return { 
            ...state, 
            projects: updateArray(
                state.projects, 
                state.currentProjectId, 
                (project: IProject) => updateObject(project, 
                    { tasks: updateArray(
                        project.tasks, task.id, () => ({ ...task })
                    )})
            ) 
        }
    }
    case "ADD_TASK": {
        const { task } = action
        return { 
            ...state, 
            projects: updateArray(
                state.projects, 
                state.currentProjectId, 
                (project: IProject) => {
                    task.id = generateNextId(project.tasks)
                    return updateObject(project, { tasks: project.tasks.concat(task) }) 
                }  
            ),
            justAddedItemId: task.id
        }   
    }
    case "DELETE_TASK": {
        return updateProjects(state,
            (project: IProject) => 
                updateObject(project, 
                    { tasks: project.tasks.filter(task => task !== action.task) }))
    }
    case "SET_TITLE": {
        return updateProjects(state,
                    (project: IProject) => updateObject(project, {text: action.title})) 
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

const updateObject = (oldObject: any, newValues: any) => {
    return Object.assign({}, oldObject, newValues)
}

const updateArray = 
    (array: any[], itemId: number, updateItemCallback: Function) => {
        return array.map((item: any) => 
            item.id !== itemId ? item : updateItemCallback(item))
}

const updateProjects = (state: IStore, updateProjectCallback: Function) => {
    return { 
        ...state, 
        projects: updateArray(
            state.projects, 
            state.currentProjectId, 
            updateProjectCallback
        )
    }
}