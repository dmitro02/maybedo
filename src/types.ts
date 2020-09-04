export class Task {
    path: string
    text: string
    isDone: boolean
    tasks: Task[]
    selectedTaskPath?: string

    constructor(path: string, text: string, isDone: boolean = false) {
        this.path = path
        this.text = text
        this.isDone = isDone
        this.tasks = []
    }
}