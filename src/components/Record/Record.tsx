import React, { useState, useRef, useEffect } from 'react'
import './Record.scss'
import { ITask } from '../../types'
import { useTasksContext } from '../../contexts/TasksContext'
import { setAddedRecordId } from '../../contexts/actionCreators'
import { 
    debounceInput, 
    moveCaretToEndAndFocus 
} from '../../utils'

export interface IRecordConfig {
    useCheckMark: boolean
    useDeleteBtn: boolean
    useDragBtn: boolean
    useEditBtn: boolean
    isEditable: boolean
}
export interface IRecordActions{
    updateRecord: Function
    deleteRecord: Function
    moveRecord: Function
}

interface IProps { item: ITask, config: IRecordConfig, actions: IRecordActions }

const Record = ({ item, config, actions }: IProps) => {
    const { isDone: initialState, text, id } = item
    
    const {
        useCheckMark,
        useDeleteBtn,
        useDragBtn,
        useEditBtn,
        isEditable
    } = config

    const { 
        updateRecord, 
        deleteRecord, 
        moveRecord 
    } = actions

    const [ isDone, setIsDone ] = useState(initialState)

    const [ store, dispatch ] = useTasksContext()

    const recordContentRef = useRef<HTMLElement>(null)

    useEffect(() => {
        if (store.addedItemId === id) {
            setContentEditable(true)
            setCaret()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, store.addedItemId])

    const handleMouseDownOnCheckbox = () => {
        setIsDone((prevState) => item.isDone = !prevState)
    }

    const handleMouseUpOnCheckbox = () => dispatch(updateRecord(item))

    const handleInput = debounceInput((text: string) => {
        item.text = text
        dispatch(updateRecord(item))
        setCaret()
    })

    const handleDelete = () => dispatch(deleteRecord(item))

    const setContentEditable = (flag: boolean) => {
        if (!useEditBtn) return
        const el = recordContentRef.current
        if (!el) return
        el.setAttribute('contenteditable', '' + flag)
        setCaret()
    }

    const handleBlur = () => {
        setContentEditable(false)
        dispatch(setAddedRecordId)
    }

    const setCaret = () => {
        const el = recordContentRef.current
        el && moveCaretToEndAndFocus(el)
    }

    return (
        <div className="record">
            {useDragBtn && <i className="material-icons drag-mark">drag_handle</i>}
            {useCheckMark && <span
                onMouseDown={handleMouseDownOnCheckbox} 
                onMouseUp={handleMouseUpOnCheckbox}
            >
                {!isDone && <i className="material-icons check-mark">check_box_outline_blank</i>}
                {isDone && <i className="material-icons check-mark">check_box</i>}
            </span>}
            <span 
                ref={recordContentRef}
                className={'item-content' + (isDone ? ' item-done' : '')} 
                contentEditable={isEditable && !useEditBtn}
                suppressContentEditableWarning={true}
                onInput={handleInput}
                onBlur={handleBlur}
            >
                {text}
            </span>
            {useEditBtn && 
                <i className="material-icons edit-btn" onClick={() => setContentEditable(true)}>edit</i>}
            {useDeleteBtn && 
                <i className="material-icons delete-btn" onClick={handleDelete}>clear</i>}
        </div>
    )
}

export default Record
