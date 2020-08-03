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
    updateArrayItem
} from '../utils'
import { actionTypes } from '../contexts/actionCreators'

interface IStore {
    projects: IProject[]
    addedItemId: number | undefined
    currentProjectId: number,
    activeListName: string | undefined
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
        case actionTypes.SET_PROJECT_TITLE: {
            return {
                ...state,
                projects: updateProjects(state,
                        (project: IProject) => updateObject(project, {text: action.title})) 
            }
        }
        case actionTypes.CREATE_TASK: {
            const { item, listName } = action
            return { 
                ...state, 
                projects: updateProjects(state,
                    (project: IProject) => {
                        item.id = generateNextId(project.tasks)
                        return updateObject(project, { tasks: project.tasks.concat(item) }) 
                    }  
                ),
                addedItemId: item.id,
                activeListName: listName
            }   
        }
        case actionTypes.UPDATE_TASK: {
            const { item } = action
            return { 
                ...state, 
                projects: updateProjects(state, 
                    (project: IProject) => updateObject(project, 
                        { tasks: updateArrayItem(project.tasks, item.id, () => ({ ...item }))})
                ),
            }
        }
        case actionTypes.DELETE_TASK: {
            return {
                ...state,
                projects: updateProjects(state,
                    (project: IProject) => updateObject(project, 
                        { tasks: project.tasks.filter(item => item !== action.item) }))
            }
        }
        case actionTypes.CREATE_PROJECT: {
            const { item, listName } = action
            const { projects } = state
            item.id = generateNextId(projects)
            return {
                ...state, 
                projects: projects.concat(item),
                addedItemId: item.id,
                activeListName: listName
            }   
        }
        case actionTypes.UPDATE_PROJECT: {
            const { item } = action
            return { 
                ...state, 
                projects: updateArrayItem(state.projects, item.id, () => ({ ...item })),
            }
        }
        case actionTypes.DELETE_PROJECT: {
            return {
                ...state,
                projects: state.projects.filter(item => item !== action.item)
            }
        }
        default:
            return state;
    }
};

const getInitialState = (): IStore => ({ 
    projects: DB,
    addedItemId: undefined,
    currentProjectId: DB[0].id,
    activeListName: undefined
})

export const createTaskObj = (
    text: string = '', 
    isDone: boolean = false, 
): ITask => ({id: -1, text, isDone})

export const createProjectObj = (
    text: string = '', 
    isDone: boolean = false, 
): IProject => ({id: -1, text, isDone, tasks: []})

const updateProjects = (state: IStore, updateProjectCallback: Function) => 
    updateArrayItem(state.projects, state.currentProjectId, updateProjectCallback)