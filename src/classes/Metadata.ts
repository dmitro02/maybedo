import * as lsUtils from '../utils/localStorageUtils'

export type Item = {
    id: string
    parentId: string | null
    updatedAt: number
}

const METADATA_KEY_NAME = 'metadata'

export class Metadata {
    taskList: { [id: string]: { p: string | null, u: number } }
    created: string[] = []
    deleted: string[] = []
    updated: string[] = []

    constructor() {
        this.taskList = {}
    }

    addToTaskList(item: Item) {
        console.log('this.taskList', this.taskList);
        // if (!this.taskList) this.taskList = {}
        const { id, parentId, updatedAt } = item
        this.taskList[id] = {
            p: parentId,
            u: updatedAt
        }
    }

    removeFromTaskList(id: string) {
        delete this.taskList[id]
    }

    addToCreated(id: string) {
        this.created.push(id)
    }

    removeFromCreated(id: string) {
        if (this.created.includes(id)) {
            this.created = this.created.filter((it) => it !== id)
        }
    }

    addToDeleted(id: string) {
        this.deleted.push(id)
    }

    addToUpdated(id: string) {
        this.updated.push(id)
    }

    registerCreated(item: Item) {
        this.addToTaskList(item)
        this.addToCreated(item.id)
        this.save()
    }

    registerUpdated(item: Item) {
        this.addToTaskList(item)
        this.save()
    }

    registerDeleted(id: string) {
        this.removeFromTaskList(id)
        this.removeFromCreated(id)
        this.addToDeleted(id)
        this.save()
    }

    getChildrenIds(parentId: string) {
        return Object.keys(this.taskList).reduce((acc: string[], curr) => {
            if (this.taskList[curr].p === parentId) acc.push(curr)
            return acc
        }, [])
    }

    save() {
        const metadata = {
            taskList: this.taskList,
            created: this.created,
            deleted: this.deleted
        }
        lsUtils.setObject(METADATA_KEY_NAME, metadata)
    }

    restore() {
        const metadata = lsUtils.getObject(METADATA_KEY_NAME)
        this.taskList = metadata.taskList
        this.created = metadata.created
        this.deleted = metadata.deleted
    }

    reset() {
        this.created = []
        this.deleted = []
        this.updated = []
        this.save()
    }

    init() {
        localStorage.getItem(METADATA_KEY_NAME)
            ? this.restore() 
            : this.save()
    }
}

const metadata = new Metadata()

export default metadata
