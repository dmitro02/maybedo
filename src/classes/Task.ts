import { generateId } from '../utils/commonUtils';

export enum Priorities {
    Trivial,
    Minor,
    Normal,
    Major,
    Critical
}

export default class Task {
    text: string
    isDone: boolean
    tasks: string[]
    priority: Priorities
    isOpened?: boolean
    selectedSubTaskId?: string
    isProject?: boolean
    isNew?: boolean
    id: string
    updatedAt: number

    constructor(props: any = {}) {
        const {
            id, 
            text, 
            isDone, 
            tasks, 
            isNew, 
            priority, 
            isProject,
            updatedAt
        } = props

        this.id = id || generateId()
        this.text = text || ''
        this.isDone = isDone || false
        this.tasks = tasks || []
        this.isNew = isNew || false
        this.priority = priority || Priorities.Trivial
        this.isProject = isProject || false
        this.updatedAt = updatedAt || Date.now()
    }

    get hasSubtasks() {
        return !!this.tasks.length
    }
}
