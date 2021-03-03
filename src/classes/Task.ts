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
    tasks: Task[]
    priority: Priorities
    isOpened?: boolean
    selectedSubTaskId?: string
    
    isNew: boolean
    parent: Task | null
    id: string

    constructor(text: string, parent: Task | null, isDone?: boolean, id?: string) {
        this.id = id || generateId()
        this.text = text
        this.isDone = isDone || false
        this.tasks = []
        this.isNew = false
        this.parent = parent
        this.priority = Priorities.Trivial
    }

    get isProject() {        
        return !!!this.parent?.parent
    }
}
