import React, { useRef, useEffect } from 'react'
import { 
    useTasksContext, 
    createTaskObj
} from '../../contexts/TasksContext'
import Divider from '../Divider/Divider'
import AddRecord from '../Record/AddRecord'
import { ITask } from '../../types'
import Record, { RecordConfig } from '../Record/Record'
import Sortable from 'sortablejs'
import './RecordList.scss'
import {
    createTaskAction,
    moveTaskAction
} from '../../contexts/actionCreators'
import { constructNewPath } from '../../contexts/contextUtils'

type Props = { 
    classNames?: string[],
    root: ITask,
    activeRecordConfig: RecordConfig,
    completedRecordConfig: RecordConfig,
    titleRecordConfig: RecordConfig
}

const RecordList = (props: Props) => {
    const [ store, dispatch ] = useTasksContext()

    const {
        classNames = [],
        root,
        activeRecordConfig,
        completedRecordConfig,
        titleRecordConfig
    } = props

    const { tasks } = root

    const activeTasks = tasks.filter((t: ITask) => !t.isDone)
    const completedTasks = tasks.filter((t: ITask) => t.isDone)

    const activeItemListRef = useRef<HTMLDivElement>(null)

    const handleItemMove = (e: any) => {
        const movedItemPath = e.item.id
        const sibling = e.item.previousSibling
        const siblingPath = sibling ? sibling.id : null
        dispatch(moveTaskAction(movedItemPath, siblingPath))
    }

    useEffect(() => {
        new Sortable(activeItemListRef.current!, {
            animation: 150, 
            onEnd: handleItemMove
        })
    })

    const createRecord = (text: string) => {
        const item: ITask = createTaskObj(constructNewPath(root), text)
        dispatch(createTaskAction(item))
    }

    return (
        <div className={`tasks-box ${classNames.join(' ')}`}>
            <Record 
                item={root} 
                config={titleRecordConfig}
                parent={store.rootProject}
            />
            <Divider />
            <div className="active-tasks" ref={activeItemListRef}>
                {activeTasks.map(
                    (task: ITask) => 
                        <Record 
                            key={task.path} 
                            item={task} 
                            config={activeRecordConfig}
                            parent={root}
                        />
                )}
            </div>
            <AddRecord addNewRecord={createRecord}/>
            <Divider isHidden={!completedTasks.length} />
            <div className="completed-tasks">
                {completedTasks.map(
                    (task: ITask) => 
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
