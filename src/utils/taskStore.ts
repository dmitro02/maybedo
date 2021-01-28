import { Task } from "../types"

class TaskStore {
    private _taskList: Task = new Task('Projects', null)

    updatedAt: number = 0

    get taskList() {
        return this._taskList
    }

    private setTaskList(taskList: Task) {
        if (!taskList) return
        this._taskList = taskList
        this.linkTasks(this._taskList, null)
    }

    setData(taskList: string | Task, updatedAt: number) {
        const data: Task = typeof taskList === 'string'
            ? JSON.parse(taskList)
            : taskList 
        
        this.setTaskList(data)
        this.setUpdatedAt(updatedAt)
    }

    createTask(newTask: Task): void {
        const { parent } = newTask
        parent!.tasks.push(newTask)
        this.setUpdatedAt()
    }

    updateTask(): void {
        this.setUpdatedAt()
    }

    deleteTask(deletedTask: Task): void {
        const { parent } = deletedTask
        parent!.tasks = parent!.tasks.filter((it) => it !== deletedTask)
        this.setUpdatedAt()
    }

    selectTask(selectedTask: Task): void {
        const { parent } = selectedTask
        parent!.selectedSubTaskId = selectedTask.id
        this.setUpdatedAt()
    }

    private setUpdatedAt(updatedAt?: number) {
        this.updatedAt = updatedAt || Date.now()
    }

    private linkTasks(task: Task, parentTask: Task | null): void {
        task.parent = parentTask
        if (task.tasks) {
            task.tasks.forEach((childTask: Task) => this.linkTasks(childTask, task))
        }    
    }

    get taskListJSON() {
        const excludeKeys = [
            // TODO: remove path when no longer exists
            'path',
            'parent',
            'isNew'
        ]
        const replacer = (key: string, value: any) =>
            excludeKeys.includes(key) ? undefined : value
    
        return JSON.stringify(this._taskList, replacer, 2)
    }
}

const taskStore = new TaskStore()

export default taskStore