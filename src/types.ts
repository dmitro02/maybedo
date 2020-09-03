export interface ITask { 
    path: string
    text: string
    isDone: boolean
    tasks: ITask[]
    selectedTaskPath?: string
}