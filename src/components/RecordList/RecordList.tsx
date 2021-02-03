import { useRef } from 'react'
import Divider from '../Divider/Divider'
import AddRecord from '../Record/AddRecord'
import { Priorities, Task } from '../../types'
import Record, { RecordConfig } from '../Record/Record'

type Props = { 
    classNames?: string[],
    root: Task,
    activeRecordConfig?: RecordConfig,
    completedRecordConfig?: RecordConfig,
    titleRecordConfig?: RecordConfig
}

const RecordList = (props: Props) => {
    const {
        classNames = [],
        root,
        activeRecordConfig,
        completedRecordConfig,
        titleRecordConfig
    } = props

    const { tasks } = root

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
            {titleRecordConfig && 
                <>
                    <Record 
                        item={root} 
                        config={titleRecordConfig}
                    />
                    <Divider />
                </>
            }
            <div className="active-tasks" ref={activeItemListRef}>
                {activeTasks.map(
                    (task: Task) => 
                        <Record 
                            key={task.id} 
                            item={task} 
                            config={activeRecordConfig}
                        />
                )}
            </div>
            <AddRecord root={root}/>
            <Divider isHidden={!completedTasks.length} />
            <div className="completed-tasks">
                {completedTasks.map(
                    (task: Task) => 
                        <Record 
                            key={task.id}
                            item={task} 
                            config={completedRecordConfig}
                        />
                )}
            </div>
        </div>
    )
}

export default RecordList
