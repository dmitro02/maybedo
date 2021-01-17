import React, { useRef, useEffect } from 'react'
import { useTasksContext } from '../../contexts/TasksContext'
import Divider from '../Divider/Divider'
import AddRecord from '../Record/AddRecord'
import { Task } from '../../types'
import Record, { RecordConfig } from '../Record/Record'
import Sortable from 'sortablejs'
import { isTaskLevelItem } from '../../utils/pathUtils'

type Props = { 
    classNames?: string[],
    root: Task,
    activeRecordConfig: RecordConfig,
    completedRecordConfig: RecordConfig,
    titleRecordConfig?: RecordConfig
}

const RecordList = (props: Props) => {
    const { store, actions } = useTasksContext()

    const {
        classNames = [],
        root,
        activeRecordConfig,
        completedRecordConfig,
        titleRecordConfig
    } = props

    const { tasks } = root

    const activeTasks = tasks.filter((t: Task) => !t.isDone)
    const completedTasks = tasks.filter((t: Task) => t.isDone)

    const activeItemListRef = useRef<HTMLDivElement>(null)

    const handleItemMove = (e: any) => {
        const movedItemPath = e.item.id
        const sibling = e.item.previousSibling
        const siblingPath = sibling ? sibling.id : null
        actions.moveTaskAction(movedItemPath, siblingPath)
    }

    useEffect(() => {
        new Sortable(activeItemListRef.current!, {
            animation: 150, 
            onEnd: handleItemMove
        })
    })

    return (
        <div className={classNames.join(' ')}>
            {titleRecordConfig && 
                <Record 
                    item={root} 
                    config={titleRecordConfig}
                    parent={store.taskList}
                />
            }
            <Divider isHidden={isTaskLevelItem(root)} />
            <div className="active-tasks" ref={activeItemListRef}>
                {activeTasks.map(
                    (task: Task) => 
                        <Record 
                            key={task.path} 
                            item={task} 
                            config={activeRecordConfig}
                            parent={root}
                        />
                )}
            </div>
            <AddRecord root={root}/>
            <Divider isHidden={!completedTasks.length} />
            <div className="completed-tasks">
                {completedTasks.map(
                    (task: Task) => 
                        <Record 
                            key={task.path}
                            item={task} 
                            config={completedRecordConfig}
                            parent={root}
                        />
                )}
            </div>
        </div>
    )
}

export default RecordList
