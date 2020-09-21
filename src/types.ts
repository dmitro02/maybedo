export class Task {
    path: string
    text: string
    isDone: boolean
    tasks: Task[]
    selectedSubTaskPath?: string

    constructor(path: string, text: string, isDone: boolean = false) {
        this.path = path
        this.text = text
        this.isDone = isDone
        this.tasks = []
    }
}

export interface IModal {
    text: string
    okAction?: () => void 
    cancelAction?: () => void
}

export interface IBanner {
    text: string
    type: BannerTypes
    delay?: number
}

export enum BannerTypes {
    Success = "success",
    Warning = "warning",
    Failure = "failure"
}