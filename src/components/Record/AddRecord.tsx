import React from 'react'
import './Record.scss'

interface IProps { addNewRecord: Function }

const AddRecord = ({ addNewRecord }: IProps) => {
    const createRecord = (e: any) => {
        if (!e.target.textContent.trim()) return
        addNewRecord(e.target.textContent)
        e.target.textContent = ''
    }

    const preventEnterOnEmpty = (e: any) => {
        !e.target.textContent.trim() && e.key === 'Enter' && e.preventDefault()
    }

    return (  
        <div className="record add-record">
            <i className="material-icons add-mark">add</i>
            <span 
                className="item-content" 
                contentEditable="true"
                suppressContentEditableWarning={true}
                onInput={createRecord}
                onKeyPress={preventEnterOnEmpty}
            ></span>
        </div>
    )
}

export default AddRecord