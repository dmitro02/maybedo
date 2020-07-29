import React, { useEffect, useRef } from 'react'
import './TaskList.scss'
import Record, { IRecordConfig } from '../Record/Record'
import { ITask } from '../../types'
import Sortable from 'sortablejs';

interface IProps { tasks: ITask[] }

const TaskList = ({ tasks }: IProps) => {
    const thisList = useRef(null)

    useEffect(() => {
        const tl = thisList.current
        tl && new Sortable(tl, { animation: 150 });
    }, [])

    const recordConfig: IRecordConfig = {
        useCheckMark: true,
        useDeleteBtn: true,
        useDragBtn: true,
        useEditBtn: false,
        isEditable: true
    }

    return (
        <div className="task-list" ref={thisList}>
            {tasks.map(
                task => <Record key={task.id} task={task} config={recordConfig}/>
            )}
        </div>
    )
}

export default TaskList