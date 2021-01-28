import { SyncTargets } from './Syncer';

export default class LsConnector {
    public static saveToLocalStorage = (updatedAt: number, taskList: string | null): void => {
        if (!taskList) return
        LsConnector.setLsUpdatedAt(updatedAt)
        LsConnector.setLsTaskList(taskList)
    }
    
    public static getLsUpdatedAt(): number {
        const item = localStorage.getItem('updatedAt')
        return item ? parseInt(item) : 0
    }
    
    public static setLsUpdatedAt(updatedAt: number): void {
        localStorage.setItem('updatedAt', updatedAt.toString())
    }
    
    public static getLsTaskList(): string | null {
        const item = localStorage.getItem('taskList')
        return (item && item !== '{}') ? item : null
    }
    
    public static setLsTaskList(taskList: string): void {
        localStorage.setItem('taskList', taskList)
    }

    public static getSyncTarget(): SyncTargets {
        return localStorage.getItem('syncTarget') as SyncTargets
    }

    public static setSyncTarget(syncTarget: SyncTargets): void {
        localStorage.setItem('syncTarget', syncTarget)
    }
}