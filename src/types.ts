export interface ITask { 
    isDone: boolean
    data: string
    id: number
}

export interface IFullTasksList {
    activeTasks: ITask[]
    completedTasks: ITask[]
  } 
