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
    priority: Priorities
    isOpened?: boolean
    isProject?: boolean
    id: string
    updatedAt: number
    parentId: string | null

    constructor(props: any = {}) {
        const {
            id = generateId(), 
            text = '', 
            isDone = false, 
            priority = Priorities.Trivial, 
            isProject = false,
            updatedAt = Date.now(),
            parentId = null
        } = props

        this.id = id
        this.text = text
        this.isDone = isDone
        this.priority = priority
        this.isProject = isProject
        this.updatedAt = updatedAt
        this.parentId = parentId
    }
}
