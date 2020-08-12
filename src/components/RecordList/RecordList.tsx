import React, { useRef, useEffect } from 'react'
import { 
    useTasksContext, 
    createTaskObj
} from '../../contexts/TasksContext'
import Divider from '../Divider/Divider'
import AddRecord from '../Record/AddRecord'
import { ITask } from '../../types'
import Record, { 
    RecordConfig, 
    RecordActions 
} from '../Record/Record'
import Sortable from 'sortablejs'
import './RecordList.scss'
import TitleRecord from '../TitleRecord/TitleRecord'
import {
    createTaskAction,
    updateTaskAction,
    deleteTaskAction,
    moveTaskAction
} from '../../contexts/actionCreators'

type Props = { 
    classNames?: string[],
    root: ITask,
    activeRecordConfig: RecordConfig,
    completedRecordConfig: RecordConfig
}

const RecordList = (props: Props) => {
    const [ , dispatch ] = useTasksContext()

    const {
        classNames = [],
        root,
        activeRecordConfig,
        completedRecordConfig
    } = props

    const { path: listPath, tasks, selectedTaskPath } = root

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

    const getNewPath = () => {
        return tasks.length 
            ? listPath + ':' + (tasks
                .map(t => parseInt(t.path.split(':').reverse()[0]))
                .reduce((prev, curr) => Math.max(prev, curr)) + 1)
            : listPath + ':1'
    }

    const createRecord = (text: string) => {
        const item: ITask = createTaskObj(getNewPath(), text)
        dispatch(createTaskAction(item))
    }

    const recordActions: RecordActions = {
        updateRecord: (item: ITask) => dispatch(updateTaskAction(item)),
        deleteRecord: (item: ITask) => dispatch(deleteTaskAction(item)),
        selectRecord: (item: ITask) => {
            root.selectedTaskPath = item.path
            dispatch(updateTaskAction(root))
        }
    }

    return (
        <div className={`tasks-box ${classNames.join(' ')}`}>
            <TitleRecord item={root} setTitle={(item: ITask )=> dispatch(updateTaskAction(item))} />
            <Divider />
            <div className="active-tasks" ref={activeItemListRef}>
                {activeTasks.map(
                    (task: ITask) => 
                        <Record 
                            key={task.path} 
                            item={task} 
                            config={activeRecordConfig}
                            actions={recordActions}
                            isSelected={task.path === selectedTaskPath}
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
                            actions={recordActions}
                            isSelected={task.path === selectedTaskPath}
                        />
                )}
            </div>
        </div>
    )
}

export default RecordList
