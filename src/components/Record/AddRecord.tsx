import React, { memo } from 'react'
import './Record.scss'

type Props = { addNewRecord: Function }

const AddRecord = ({ addNewRecord }: Props) => {
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

export default memo(AddRecord)