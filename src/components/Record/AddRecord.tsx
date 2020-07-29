import React from 'react'
import './Record.scss'

interface IProps { addRecord: Function }

const AddRecord = ({ addRecord }: IProps) => {
    const createRecord = (e: any) => {
        if (!e.target.textContent.trim()) return
        addRecord(e)
        e.target.textContent = ''
    }

    const preventEnterOnEmpty = (e: any) => {
        !e.target.textContent.trim() && e.key === 'Enter' && e.preventDefault()
    }

    return (  
        <div className="record add-record">
            <i className="material-icons add-mark">add</i>
            <span 
                className="task-content" 
                contentEditable="true"
                suppressContentEditableWarning={true}
                onInput={createRecord}
                onKeyPress={preventEnterOnEmpty}
            ></span>
        </div>
    )
}

export default AddRecord