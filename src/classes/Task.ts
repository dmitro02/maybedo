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
    id: string
    updatedAt: number
    parentId: string | null

    constructor(props: any = {}) {
        const {
            id = generateId(), 
            text = '', 
            isDone = false, 
            priority = Priorities.Trivial, 
            updatedAt = Date.now(),
            parentId = null
        } = props

        this.id = id
        this.text = text
        this.isDone = isDone
        this.priority = priority
        this.updatedAt = updatedAt
        this.parentId = parentId
    }
}
