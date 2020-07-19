import React from 'react'
import './TaskRecord.scss'

const AddTask = () => {
    return (  
        <div className="task-record add-record">
            <i className="material-icons add-mark">add</i>
            <span 
                className="task-content" 
                contentEditable="true"
            >
                new task
            </span>
        </div>
    )
}

export default AddTask