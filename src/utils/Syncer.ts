import { IStore } from "../contexts/TasksContext"
import { Task } from "../types"

export default class Syncer {
    private cloudConnector: any
    private memoryUpdatedAt: number = 0
    private lsUpdatedAt: number = 0
    private cloudUpdatedAt: number = 0
    private isOnline: boolean = false

    constructor(cloudConnector?: any) {
        this.cloudConnector = cloudConnector
    }

    synchronize(store: IStore): IStore {
        this.memoryUpdatedAt = store.updatedAt || 0
        this.lsUpdatedAt = this.getLsUpdatedAt()

        try {
            const cloudMetadata = this.cloudConnector.getMetadata()
            this.cloudUpdatedAt = cloudMetadata?.updatedAt || 0
            this.isOnline = true 
        } catch(e) {
            this.isOnline = false
        }

        if (this.cloudUpdatedAt > this.lsUpdatedAt) {
            return this.updateFromCloud(store)
        } else if (this.memoryUpdatedAt > this.lsUpdatedAt) {
            return this.updateFromMemory(store)
        } else if (this.memoryUpdatedAt < this.lsUpdatedAt) {
            return this.updateFromLocalStorage(store) 
        } else {
            return store;
        }
    }

    private updateFromMemory(store: IStore): IStore {
        this.updateCloudfromLocalStorage()
        return this.updateLocalStoragefromMemory(store)
    }
      
    private updateFromLocalStorage(store: IStore): IStore {
        this.updateCloudfromLocalStorage()
        return this.updateMemoryFromLocalStorage(store)
    }
      
    private updateFromCloud(store: IStore): IStore {
        this.updateLocalStorageFromCloud()
        return this.updateMemoryFromLocalStorage(store)
    }
      
    private updateLocalStorageFromCloud() {
        const cloudTaskList = this.cloudConnector.downloadTaskList()
        this.setLsUpdatedAt(this.cloudUpdatedAt)
        this.setLsTaskList(cloudTaskList)
    }
      
    private updateCloudfromLocalStorage(): void {
        if (!this.isOnline) return
        const taskList = this.getLsTaskList()
        this.cloudConnector.uploadTaskList(taskList)
        this.cloudConnector.uploadMetadata({ updatedAt: this.lsUpdatedAt})
    }
      
    private updateMemoryFromLocalStorage(store: IStore): IStore {
        const taskList = this.getLsTaskList()
        return { 
            ...store,
            updatedAt: this.lsUpdatedAt,
            rootProject: taskList
         }
    }
      
    private updateLocalStoragefromMemory(store: IStore): IStore {
        this.setLsUpdatedAt(this.memoryUpdatedAt)
        this.setLsTaskList(store.rootProject)
        return store
    }

    private getLsUpdatedAt(): number {
        const item = localStorage.getItem('updatedAt')
        return item ? parseInt(item) : 0
    }

    private setLsUpdatedAt(updatedAt: number): void {
        localStorage.setItem('updatedAt', updatedAt.toString())
    }

    private getLsTaskList(): Task {
        const item = localStorage.getItem('taskList')
        return item ? JSON.parse(item) : null
    }

    private setLsTaskList(taskList: Task): void {
        localStorage.setItem('taskList', JSON.stringify(taskList))
    }
}
