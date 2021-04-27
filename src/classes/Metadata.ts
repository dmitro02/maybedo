import * as ls from '../services/localStorageService'

export const ROOT_ID = '0'

export type Item = {
    id: string
    parentId: string | null
    updatedAt: number
}

export type TaskList = { [id: string]: { p: string | null, u: number } }

export class Metadata {
    taskList: TaskList
    created: string[] = []
    deleted: string[] = []
    updated: string[] = []

    constructor(taskList: TaskList = {}) {
        this.taskList = taskList
    }

    addToTaskList(item: Item): void {
        const { id, parentId, updatedAt } = item
        this.taskList[id] = {
            p: parentId,
            u: updatedAt
        }
    }

    removeFromTaskList(id: string): void {
        delete this.taskList[id]
    }

    addToCreated(id: string): void {
        this.created.push(id)
    }

    removeFromCreated(id: string): void {
        if (this.created.includes(id)) {
            this.created = this.created.filter((it) => it !== id)
        }
    }

    addToDeleted(id: string): void {
        this.deleted.push(id)
    }

    addToUpdated(id: string): void {
        this.updated.push(id)
    }

    registerCreated(item: Item): void {
        this.addToTaskList(item)
        this.addToCreated(item.id)
        this.save()
    }

    registerUpdated(item: Item): void {
        this.addToTaskList(item)
        this.save()
    }

    registerDeleted(id: string): void {
        this.removeFromTaskList(id)
        this.created.includes(id)
            ? this.removeFromCreated(id)
            : this.addToDeleted(id)
        this.save()
    }

    getChildrenIds(parentId: string): string[] {
        return this.getAllTaskIds().reduce((acc: string[], curr) => {
            if (this.taskList[curr].p === parentId) acc.push(curr)
            return acc
        }, [])
    }

    hasChildren(parentId: string): boolean {
        return Object.values(this.taskList).some((it) => it.p === parentId)
    }

    isProject(taskId: string): boolean {
        const taskMetaRecord = this.taskList[taskId]
        return taskMetaRecord && taskMetaRecord.p === ROOT_ID
    }

    isRoot(taskId: string): boolean {
        return taskId === ROOT_ID
    }

    getAllTaskIds(): string[] {
        return Object.keys(this.taskList)
    }

    save(): void {
        const metadata = {
            taskList: this.taskList,
            created: this.created,
            deleted: this.deleted
        }
        ls.setMetadada(metadata)
    }

    restore(): void {
        const metadata = ls.getMetadada()
        this.taskList = metadata.taskList
        this.created = metadata.created
        this.deleted = metadata.deleted
    }

    reset(): void {
        this.created = []
        this.deleted = []
        this.updated = []
        this.save()
    }

    init(): void {
        ls.hasMetadata()
            ? this.restore() 
            : this.save()
    }
}

const metadata = new Metadata()

export default metadata
