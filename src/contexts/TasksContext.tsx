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
import { actionTypes } from '../contexts/actionCreators'

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

const tasksReducer = (state: IStore, action: any): IStore => {
  switch (action.type) {
    case actionTypes.CHANGE_TASK: {
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
    case actionTypes.ADD_TASK: {
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
    case actionTypes.DELETE_TASK: {
        return {
            ...state,
            projects: updateProjects(state,
                (project: IProject) => updateObject(project, 
                    { tasks: project.tasks.filter(task => task !== action.task) }))
        }
    }
    case actionTypes.SET_TITLE: {
        return {
            ...state,
            projects: updateProjects(state,
                    (project: IProject) => updateObject(project, {text: action.title})) 
        }
    }
    case actionTypes.SET_ADDED_TASK: {
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