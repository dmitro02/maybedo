import { 
    useCallback, 
    useEffect, 
    useRef, 
    useState 
} from 'react'
import AddRecord from '../Record/AddRecord'
import Task, { Priorities } from '../../classes/Task'
import Record from '../Record/Record'
import './RecordList.scss'
import { 
    createTask, 
    deleteTask, 
    deleteTasks, 
    getSubTasksList, 
    getTask, 
    ROOT_ID, 
    updateTask 
} from '../../utils/taskService'
import { store, useEvent } from '../../classes/Store'

type Props = { 
    classNames?: string[],
    rootId: string,
    hasTitle?: boolean,
    isEditable?: boolean,
    projectId?: string
}

const RecordList = (props: Props) => {
    const {
        classNames = [],
        rootId,
        hasTitle = false,
        isEditable = true,
        projectId
    } = props

    const [root, setRoot] = useState<Task>(new Task())
    const [subTasks, setSubTasks] = useState<Task[]>([])

    useEffect(() => {
        const task = getTask(rootId)
        setRoot(task)

        const subTasks = getSubTasksList(rootId)
        setSubTasks(subTasks)
    }, [rootId])

    const focusedItemId = useRef<string>()

    const isRootProject = rootId === ROOT_ID

    const addSubTask = useCallback((task: Task) => {
        task.isProject = isRootProject
        task.parentId = root.id

        createTask(task)
        
        focusedItemId.current = task.id

        const newSubTasks = subTasks.concat(task)
        setSubTasks(newSubTasks)

        if (task.isProject) store.selectedProjectId = task.id
    }, [isRootProject, root.id, subTasks])

    const updateSubTask = useCallback((task: Task) => {
        const newSubTasks = subTasks.map((it) => {
            return it.id === task.id ? task : it  
        })
        setSubTasks(newSubTasks)
        updateTask(task)
    }, [subTasks])

    const deleteSubTask = useCallback((task: Task) => {
        const isSelectedPojectDeleted = store.selectedProjectId === task.id
        const newSubTasks = subTasks.filter((it) => it !== task)
        setSubTasks(newSubTasks)
        deleteTask(task.id)
        if (isSelectedPojectDeleted) store.selectedProjectId = ''
    }, [subTasks])

    const deleteCompletedSubTask = useCallback(() => {
        const idsToDelete = subTasks.filter((it) => it.isDone).map((it) => it.id)
        const isSelectedPojectDeleted = idsToDelete
            .some((id) => store.selectedProjectId === id)
        const newSubTasks = subTasks.filter((it) => !it.isDone)
        setSubTasks(newSubTasks)
        deleteTasks(idsToDelete)
        if (isSelectedPojectDeleted) store.selectedProjectId = ''
    }, [subTasks])

    useEvent('deleteCompleted' + rootId, deleteCompletedSubTask)

    // sort subtask by priority
    const setAndComparePriotity = (a: Task, b: Task) => {
        const pa = a.priority || Priorities.Trivial
        const pb = b.priority || Priorities.Trivial

        if (pa > pb) return -1
        if (pa < pb) return 1
        return 0
    }
    subTasks.sort(setAndComparePriotity)

    const activeTasks = subTasks.filter((t) => !t.isDone)
    const completedTasks = subTasks.filter((t) => t.isDone)

    const activeItemListRef = useRef<HTMLDivElement>(null)

    const classes = [
        isRootProject ? 'project-list' : 'task-list',
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
                            isEditable={isEditable}
                            isSelected={projectId === task.id}
                            update={updateSubTask}
                            remove={deleteSubTask}
                            isFocused={focusedItemId.current === task.id}
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
                            isSelected={projectId === task.id}
                            update={updateSubTask}
                            remove={deleteSubTask}
                        />
                )}
            </div>}
        </div>
    )
}

export default RecordList
