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

export type ExportedData = {
    timestamp: number
    tasklist: Task
}

export class FailureBanner implements IBanner {
    text: string
    type: BannerTypes

    constructor(text: string) {
        this.text = text
        this.type = BannerTypes.Failure
    }
}

export class SuccessBanner implements IBanner {
    text: string
    type: BannerTypes
    delay: number

    constructor(text: string, delay: number = 5) {
        this.text = text
        this.type = BannerTypes.Success
        this.delay = delay
    }
}
