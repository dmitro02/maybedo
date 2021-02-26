import { useEffect, useRef } from 'react'
import AddRecord from '../Record/AddRecord'
import { Priorities, Task } from '../../types'
import Record from '../Record/Record'
import './RecordList.scss'
import taskStore from '../../utils/Store'
import { useForceUpdate } from '../../utils/customHooks'

type Props = { 
    classNames?: string[],
    root: Task,
    hasTitle?: boolean,
    isEditable?: boolean
}

const RecordList = (props: Props) => {
    const {
        classNames = [],
        root,
        hasTitle = false,
        isEditable = true
    } = props

    const { tasks } = root

    const forceUpdate = useForceUpdate()
    
    useEffect(() => {
        const callback = (id: string) => {
            console.log('ROOT ID:', root.id);
            console.log('UPDATE ID:', id);
            if (id === root.id) forceUpdate()
        }
        taskStore.subscribe(callback)

        return () => taskStore.unsubscribe(callback)
    }, [forceUpdate, root.id])


    // sort subtask by priority
    const setAndCompare = (a: Task, b: Task) => {
        if (a.priority === undefined) a.priority = Priorities.Trivial 
        if (b.priority === undefined) b.priority = Priorities.Trivial

        if (a.priority > b.priority) return -1
        if (a.priority < b.priority) return 1
        return 0
    }
    tasks.sort(setAndCompare)

    const activeTasks = tasks.filter((t: Task) => !t.isDone)
    const completedTasks = tasks.filter((t: Task) => t.isDone)

    const activeItemListRef = useRef<HTMLDivElement>(null)

    return (
        <div className={classNames.join(' ')}>
            {hasTitle && 
                <>
                    <Record 
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
                            isSelected={root.selectedSubTaskId === task.id && !root.parent}
                        />
                )}
            </div>
            <AddRecord root={root}/>
            {!!completedTasks.length && <div className="completed-tasks">
                {completedTasks.map(
                    (task: Task) => 
                        <Record 
                            key={task.id}
                            item={task}
                            isEditable={isEditable}
                            isSelected={root.selectedSubTaskId === task.id && !root.parent}
                        />
                )}
            </div>}
        </div>
    )
}

export default RecordList
