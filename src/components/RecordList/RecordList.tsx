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
import Sortable from 'sortablejs';
import './RecordList.scss'
import TitleRecord from '../TitleRecord/TitleRecord'

interface IProps { 
    listName: string,
    root: ITask,
    createRecordAction: Function,
    moveRecordAction: Function,
    setTitle?: Function,
    activeRecordConfig: RecordConfig,
    completedRecordConfig: RecordConfig,
    recordActions: RecordActions
}

const RecordList = (props: IProps) => {
    const [ , dispatch ] = useTasksContext()

    const {
        listName,
        root,
        createRecordAction,
        moveRecordAction,
        setTitle = undefined,
        activeRecordConfig,
        completedRecordConfig,
        recordActions
    } = props

    const { tasks } = root

    const activeTasks = tasks.filter((t: ITask) => !t.isDone)
    const completedTasks = tasks.filter((t: ITask) => t.isDone)

    const activeItemListRef = useRef<HTMLDivElement>(null)

    const handleItemMove = (e: any) => {
        const movedItemId = parseInt(e.item.id.split(':')[1])
        const sibling = e.item.previousSibling
        const siblingId = sibling 
            ? parseInt(sibling.id.split(':')[1])
            : null
        dispatch(moveRecordAction(movedItemId, siblingId))
    }

    useEffect(() => {
        new Sortable(activeItemListRef.current!, {
            animation: 150, 
            onEnd: handleItemMove
        })
    })

    const createRecord = (text: string) => {
        const item: ITask = createTaskObj(text)
        dispatch(createRecordAction(item, listName))
    }

    return (
        <div className="tasks-box">
            <TitleRecord item={root} setTitle={setTitle} />
            <Divider />
            <div className="active-tasks" ref={activeItemListRef}>
                {activeTasks.map(
                    (task: ITask) => 
                        <Record 
                            key={task.id} 
                            item={task} 
                            config={activeRecordConfig}
                            actions={recordActions}
                        />
                )}
            </div>
            <AddRecord addNewRecord={createRecord}/>
            <Divider isHidden={!completedTasks.length} />
            <div className="completed-tasks">
                {completedTasks.map(
                    (task: ITask) => 
                        <Record 
                            key={task.id} 
                            item={task} 
                            config={completedRecordConfig}
                            actions={recordActions}
                        />
                )}
            </div>
        </div>
    )
}

export default RecordList
