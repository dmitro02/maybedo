import { useEffect, useRef, useState } from 'react'
import AddRecord from '../Record/AddRecord'
import Task, { Priorities } from '../../classes/Task'
import Record from '../Record/Record'
import './RecordList.scss'
import { 
    createTask, 
    deleteTask, 
    getTask, 
    getTaskList, 
    updateTask 
} from '../../utils/taskService'

type Props = { 
    classNames?: string[],
    rootId: string,
    hasTitle?: boolean,
    isEditable?: boolean,
    selectProject?: (id: string) => void,
}

const RecordList = (props: Props) => {
    const {
        classNames = [],
        rootId,
        hasTitle = false,
        isEditable = true,
        selectProject
    } = props

    const [root, setRoot] = useState<Task>(new Task())
    const [subTasks, setSubTasks] = useState<Task[]>([])

    const selectTask = (id: string) => {
        const newRoot = new Task(root)
        newRoot.selectedSubTaskId = id
        setRoot(newRoot)
        selectProject && selectProject(id)
    }

    useEffect(() => {
        const task = getTask(rootId)
        setRoot(task)

        const subTasks = getTaskList(task.tasks)
        setSubTasks(subTasks)
    }, [rootId])

    const addSubTask = (task: Task) => {
        if (rootId === '0') task.isProject = true
        const newSubTasks = subTasks.concat(task)
        setSubTasks(newSubTasks)
        createTask(task, root)
    }

    const updateSubTask = (task: Task) => {
        const newSubTasks = subTasks.map((it) => {
            return it.id === task.id ? task : it  
        })
        setSubTasks(newSubTasks)
        updateTask(task)
    }

    const deleteSubTask = (task: Task) => {
        const newSubTasks = subTasks.filter((it) => it !== task)
        setSubTasks(newSubTasks)
        deleteTask(task, root)
    }

    // sort subtask by priority
    const setAndComparePriotity = (a: Task, b: Task) => {
        const pa = a.priority || Priorities.Trivial
        const pb = b.priority || Priorities.Trivial

        if (pa > pb) return -1
        if (pa < pb) return 1
        return 0
    }
    subTasks.sort(setAndComparePriotity)

    const activeTasks = subTasks.filter((t: Task) => !t.isDone)
    const completedTasks = subTasks.filter((t: Task) => t.isDone)

    const activeItemListRef = useRef<HTMLDivElement>(null)

    const classes = [
        rootId === '0' ? 'project-list' : 'task-list',
        ...classNames
    ].join(' ')

    return (
        <div className={classes}>
            {hasTitle && 
                <>
                    <Record 
                        key={root.id}
                        item={root} 
                        isTitle
                        isEditable={isEditable}
                    />
                </>
            }
            <div className="active-tasks" ref={activeItemListRef}>
                {activeTasks.map(
                    (task: Task) => 
                        <Record 
                            key={task.id} 
                            item={task}
                            parent={root}
                            isEditable={isEditable}
                            isSelected={root.selectedSubTaskId === task.id && task.isProject}
                            update={updateSubTask}
                            remove={deleteSubTask}
                            selectProject={selectTask}
                        />
                )}
            </div>
            <AddRecord add={addSubTask}/>
            {!!completedTasks.length && <div className="completed-tasks">
                {completedTasks.map(
                    (task: Task) => 
                        <Record 
                            key={task.id}
                            item={task}
                            isEditable={isEditable}
                            isSelected={root.selectedSubTaskId === task.id && task.isProject}
                            update={updateSubTask}
                            remove={deleteSubTask}
                            selectProject={selectTask}
                        />
                )}
            </div>}
        </div>
    )
}

export default RecordList
