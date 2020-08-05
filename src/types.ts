export interface ITask { 
    id: number
    text: string
    isDone: boolean
    subTasks: ITask[]
}