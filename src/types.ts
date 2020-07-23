export interface ITask { 
    isDone: boolean
    data: string
    id: number
}

export interface ITaskList {
    id: number
    title: string
    tasks: ITask[]
    justAddedTaskId: number | undefined
  } 
