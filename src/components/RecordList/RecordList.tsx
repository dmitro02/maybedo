import React, { useRef, useEffect } from 'react'
import { 
    useTasksContext, 
    createTaskObj
} from '../../contexts/TasksContext'
import Title from '../Title/Title'
import Divider from '../Divider/Divider'
import AddRecord from '../Record/AddRecord'
import { ITask } from '../../types'
import Record, { 
    IRecordConfig, 
    IRecordActions 
} from '../Record/Record'
import Sortable from 'sortablejs';
import './RecordList.scss'

interface IProps { 
    listName: string,
    root: ITask,
    createRecordAction: Function,
    moveRecordAction: Function,
    setTitle: Function,
    isTitleEditable: boolean,
    activeRecordConfig: IRecordConfig,
    completedRecordConfig: IRecordConfig,
    recordActions: IRecordActions
}

const RecordList = (props: IProps) => {
    const [ , dispatch ] = useTasksContext()

    const {
        listName,
        root,
        createRecordAction,
        moveRecordAction,
        setTitle,
        isTitleEditable,
        activeRecordConfig,
        completedRecordConfig,
        recordActions
    } = props

    const { text: title, tasks: items } = root

    const activeTasks = items.filter((t: ITask) => !t.isDone)
    const completedTasks = items.filter((t: ITask) => t.isDone)

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
            <Title 
                title={title} 
                setTitle={setTitle} 
                isEditable={isTitleEditable} 
            />
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
