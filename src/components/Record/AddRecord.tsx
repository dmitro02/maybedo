import { memo, useEffect, useRef } from 'react'
import './Record.scss'
import Task from '../../classes/Task'
import { MdAdd } from 'react-icons/md'

type Props = { add: (task: Task) => void }
 
const AddRecord = ({ add }: Props) => {

    const editableRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        !window.iAmRunningOnMobile && editableRef.current?.focus()
    }, [])
    
    const createRecord = (e: any) => {
        const text = e.target.textContent.trim()
        if (!text) return
        const task = new Task({ text })
        add(task)
        e.target.textContent = ''
    }

    return (  
        <div className="record add-record">
            <div className="row-btns">
                <MdAdd />
            </div>
            <div 
                className="item-content" 
                contentEditable="true"
                suppressContentEditableWarning={true}
                onInput={createRecord}
                onKeyPress={preventEnterOnEmpty}
                ref={editableRef}
            ></div>
        </div>
    )
}

const preventEnterOnEmpty = (e: any) => {
    !e.target.textContent.trim() && e.key === 'Enter' && e.preventDefault()
}

export default memo(AddRecord)
