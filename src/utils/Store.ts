import { Task } from "../types";

class Store {
    public callbacks: Map<string, (() => void)[]> = new Map()
    public updatedAt: number = 0

    private _taskList: Task = this.toProxy(new Task('Projects', null))

    get taskList() { return this._taskList }

    get taskListJSON() {
        const excludeKeys = [
            'parent',
            'isNew'
        ]
        const replacer = (key: string, value: any) =>
            excludeKeys.includes(key) ? undefined : value
    
        return JSON.stringify(this._taskList, replacer, 2)
    }

    setData(taskList: string | Task | null, updatedAt: number) {
        if (!taskList) return
        
        const data: Task = typeof taskList === 'string'
            ? JSON.parse(taskList)
            : taskList 
        
        this.setTaskList(data)
        this.setUpdatedAt(updatedAt)
    }

    subscribe(event: string, callback: () => void) {
        const cbks = this.callbacks.get(event)
        if (cbks) {
            cbks.push(callback)
        } else {
            this.callbacks.set(event, [callback])
        }
    }

    unsubscribe(event: string, callback: () => void) {
            const cbks = this.callbacks.get(event)
            if (cbks) {
                const newCbks = cbks.filter((it) => it !== callback)
                this.callbacks.set(event, newCbks)
            }
    }

    notify(context: any) {       
        let events: string[] = []

        if (typeof context === 'string') {
            events = [ context ]
        } else {
            const { target, prop } = context
            if (prop === 'priority') {
                events = [ target.parent.id, target.id ]
            } else if (prop === 'isDone') {
                events = [ target.parent.id ]
            } else {
                events = [ target.id ]
            }
        }  

        events.forEach((event) => {
            this.callbacks.get(event)?.forEach((cbk) => cbk())
        })
    }

    private toProxy(data: Task) {
        const proxyHandler = {
            set: (target: any, prop: string, value: any) => {                
                if (prop === 'tasks') {
                    const newValue = value.map((it: any) => {
                        if (it.isProxy !== undefined) {
                            return it
                        } else {
                            return this.toProxy(it);
                        }
                    }); 
                    target[prop] = newValue
                } else {
                    target[prop] = value
                }

                if (this.isTrackableProp(prop)) {
                    this.notify({ target, prop, value })
                    this.setUpdatedAt()
                }
                return true;
            },
            get: (target: any, prop: string) => {
                if (prop === 'isProxy') return true
                return target[prop]
            }
        }
        
        data.tasks = data.tasks.map((it) => this.toProxy(it));
        if (data.parent) data.parent = new Proxy(data.parent, proxyHandler)
        return new Proxy(data, proxyHandler);
    }

    private isTrackableProp(prop: any) {
        return trackableProps.includes(prop);
    }

    private setUpdatedAt(updatedAt?: number) {
        this.updatedAt = updatedAt || Date.now()
    }

    private setTaskList(taskList: Task) {
        this.linkTasks(taskList, null)
        this._taskList = this.toProxy(taskList)
    }

    private linkTasks(task: Task, parentTask: Task | null): void {
        task.parent = parentTask;
        if (task.tasks) {
            task.tasks.forEach((childTask: Task) => {
                this.linkTasks(childTask, task)
            });
        }
    }
}

const trackableProps = [
    "text",
    "isDone",
    "tasks",
    "priority",
    "isOpened",
    "selectedSubTaskId",
];

const storer = new Store()

export default storer

export const createTask = (newTask: Task): void => {
    const { parent } = newTask
    parent!.tasks = parent!.tasks.concat(newTask)
}

export const deleteTask = (deletedTask: Task): void => {
    const { parent } = deletedTask
    parent!.tasks = parent!.tasks.filter((it) => it !== deletedTask)
}

export const deleteCompletedSubtasks = (task: Task): void => {
    task.tasks = task.tasks.filter((it) => !it.isDone)
}

export const selectTask = (selectedTask: Task): void => {
    const { parent } = selectedTask
    parent!.selectedSubTaskId = selectedTask.id
}
