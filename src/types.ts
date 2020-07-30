export interface ITask { 
    id: number
    text: string
    isDone: boolean
}

export interface IProject extends ITask {
    tasks: ITask[]
} 