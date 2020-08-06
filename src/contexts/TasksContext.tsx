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
    rootProject: ITask
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
            const { rootProject, currentProjectId } = state
            return {
                ...state,
                rootProject: updateObject(rootProject, {
                    tasks: updateArrayItem(rootProject.tasks, currentProjectId,
                        (project: ITask) => updateObject(project, {text: action.title})) 
                })
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
            const { rootProject, currentProjectId } = state
            return { 
                ...state, 
                rootProject: updateObject(rootProject, {
                    tasks: updateArrayItem(rootProject.tasks, currentProjectId,
                        (project: ITask) => {
                            item.id = generateNextId(project.tasks)
                            return updateObject(project, { tasks: project.tasks.concat(item) }) 
                        }  
                )}),
                addedItemId: item.id,
                activeListName: listName
            }   
        }
        case actionTypes.UPDATE_TASK: {
            const { item } = action
            const { rootProject, currentProjectId } = state
            return { 
                ...state, 
                rootProject: updateObject(rootProject, {
                    tasks: updateArrayItem(rootProject.tasks, currentProjectId, 
                        (project: ITask) => updateObject(project, 
                            { tasks: updateArrayItem(project.tasks, item.id, () => ({ ...item }))})
                )})
            }
        }
        case actionTypes.DELETE_TASK: {
            const { rootProject, currentProjectId } = state
            return {
                ...state,
                rootProject: updateObject(rootProject, {
                    tasks: updateArrayItem(rootProject.tasks, currentProjectId,
                        (project: ITask) => updateObject(project, 
                            { tasks: project.tasks.filter(item => item !== action.item) }))
                })
            }
        }
        case actionTypes.MOVE_TASK: {
            const { movedItemId, siblingId } = action
            const { rootProject, currentProjectId } = state
            return { 
                ...state, 
                rootProject: updateObject(rootProject, {
                    tasks: updateArrayItem(rootProject.tasks, currentProjectId,
                        (project: ITask) => {
                            const movedItem = project.tasks.find((it: ITask) => it.id === movedItemId)
                            const tasks = project.tasks.filter((it: ITask) => it.id !== movedItemId)
                            const movedItemNewIndex = siblingId
                                ? tasks.findIndex((it: ITask) => it.id === siblingId) + 1
                                : 0
                            tasks.splice(movedItemNewIndex, 0, movedItem!)
                            return updateObject(project, { tasks })
                        })
                    })
            }
        }
        case actionTypes.CREATE_PROJECT: {
            const { item, listName } = action
            const { rootProject } = state
            item.id = generateNextId(rootProject.tasks)
            return {
                ...state, 
                rootProject: updateObject(rootProject, { tasks: rootProject.tasks.concat(item) }),
                addedItemId: item.id,
                activeListName: listName
            }   
        }
        case actionTypes.UPDATE_PROJECT: {
            const { item } = action
            const { rootProject } = state
            return { 
                ...state, 
                rootProject: updateObject(rootProject, {
                    tasks: updateArrayItem(rootProject.tasks, item.id, () => ({ ...item }))
                })
            }
        }
        case actionTypes.DELETE_PROJECT: {
            const { item } = action
            const { rootProject } = state
            const projects = rootProject.tasks.filter(it => it !== item)
            return {
                ...state,
                rootProject: updateObject(rootProject, { tasks: projects }),
                currentProjectId: projects[0].id
            }
        }
        case actionTypes.MOVE_PROJECT: {
            const { movedItemId, siblingId } = action
            const { rootProject } = state
            const movedItem = rootProject.tasks.find(it => it.id === movedItemId)
            const projects = rootProject.tasks.filter(it => it.id !== movedItemId)
            const movedItemNewIndex = siblingId
                ? projects.findIndex(it => it.id === siblingId) + 1
                : 0
            projects.splice(movedItemNewIndex, 0, movedItem!)
            return { 
                ...state, 
                rootProject: updateObject(rootProject, {tasks: projects })
            }
        }
        default:
            return state;
    }
};

const getInitialState = (): IStore => ({ 
    rootProject: {
        id: 0,
        text: 'Projects',
        isDone: false,
        tasks: DB
    },
    addedItemId: undefined,
    currentProjectId: DB[0].id,
    activeListName: undefined
})

export const createTaskObj = (
    text: string = '', 
    isDone: boolean = false, 
): ITask => ({id: -1, text, isDone, tasks: []})
