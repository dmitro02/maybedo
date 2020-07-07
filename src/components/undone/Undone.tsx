import React from 'react'
import './undone.scss'
import TaskRecord from '../taskRecord/TaskRecord'

const Undone = () => {
    return (
        <div className="undone-box">
            <TaskRecord />
            <TaskRecord />
            <TaskRecord />
            <TaskRecord />
            <TaskRecord />
        </div>
    )
}

export default Undone