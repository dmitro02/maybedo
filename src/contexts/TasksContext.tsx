import React, { 
    createContext, 
    useReducer, 
    useContext 
} from "react"
import { DB } from '../mockDB'
import { ITask } from '../types'
import { 
    generateNextId,
    updateObject,
    updateArrayItem
} from '../utils'
import { actionTypes } from '../contexts/actionCreators'

interface IStore {
    projects: ITask[]
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
                        (project: ITask) => updateObject(project, {text: action.title})) 
            }
        }
        case actionTypes.SET_CURRENT_PROJECT_ID: {
            return {
                ...state,
                currentProjectId: action.item.id
            }
        }
        case actionTypes.CREATE_TASK: {
            const { item, listName } = action
            return { 
                ...state, 
                projects: updateProjects(state,
                    (project: ITask) => {
                        item.id = generateNextId(project.subTasks)
                        return updateObject(project, { subTasks: project.subTasks.concat(item) }) 
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
                    (project: ITask) => updateObject(project, 
                        { subTasks: updateArrayItem(project.subTasks, item.id, () => ({ ...item }))})
                )
            }
        }
        case actionTypes.DELETE_TASK: {
            return {
                ...state,
                projects: updateProjects(state,
                    (project: ITask) => updateObject(project, 
                        { subTasks: project.subTasks.filter(item => item !== action.item) }))
            }
        }
        case actionTypes.MOVE_TASK: {
            const { movedItemId, siblingId } = action
            return { 
                ...state, 
                projects: updateProjects(state, 
                    (project: ITask) => {
                        const movedItem = project.subTasks.find((it: ITask) => it.id === movedItemId)
                        const subTasks = project.subTasks.filter((it: ITask) => it.id !== movedItemId)
                        const movedItemNewIndex = siblingId
                            ? subTasks.findIndex((it: ITask) => it.id === siblingId) + 1
                            : 0
                        subTasks.splice(movedItemNewIndex, 0, movedItem!)
                        return updateObject(project, { subTasks })
                    })
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
        case actionTypes.MOVE_PROJECT: {
            const { movedItemId, siblingId } = action
            const movedItem = state.projects.find((it: ITask) => it.id === movedItemId)
            const projects = state.projects.filter((it: ITask) => it.id !== movedItemId)
            const movedItemNewIndex = siblingId
                ? projects.findIndex((it: ITask) => it.id === siblingId) + 1
                : 0
            projects.splice(movedItemNewIndex, 0, movedItem!)
            return { ...state, projects }
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
): ITask => ({id: -1, text, isDone, subTasks: []})

const updateProjects = (state: IStore, updateProjectCallback: Function) => 
    updateArrayItem(state.projects, state.currentProjectId, updateProjectCallback)