import { Task } from '../types';

export default class LsConnector {
    public static saveToLocalStorage = (updatedAt: number, taskList: Task | null): void => {
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
    
    public static getLsTaskList(): Task {
        const item = localStorage.getItem('taskList')
        return item && item !== '{}' ? JSON.parse(item) : null
    }
    
    public static setLsTaskList(taskList: Task): void {
        localStorage.setItem('taskList', JSON.stringify(taskList))
    }
}