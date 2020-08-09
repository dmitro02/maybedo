import React, { useState, useRef, useEffect } from 'react'
import './Record.scss'
import { ITask } from '../../types'
import { useTasksContext } from '../../contexts/TasksContext'
import { 
    debounceInput, 
    getCaretPosition,
    setCaretPosition
} from '../../utils'

export type RecordConfig = {
    listName?: string,
    useCheckMark?: boolean
    useDeleteBtn?: boolean
    useDragBtn?: boolean
    useEditBtn?: boolean
    isEditable?: boolean
}
export type RecordActions = {
    updateRecord?: Function
    deleteRecord?: Function
    selectRecord?: Function
}

type Props = { 
    item: ITask, 
    config: RecordConfig, 
    actions: RecordActions 
}

const Record = ({ item, config, actions }: Props) => {
    const { isDone: initialState, text, id } = item
    
    const {
        listName = '',
        useCheckMark = false,
        useDeleteBtn = false,
        useDragBtn = false,
        useEditBtn = false,
        isEditable = false
    } = config

    const { 
        updateRecord = () => {}, 
        deleteRecord = () => {},
        selectRecord = () => {}
    } = actions

    const [ isDone, setIsDone ] = useState(initialState)
    const [ caretPos, setCaretPos ] = useState<number|undefined>(undefined)

    const [ store ] = useTasksContext()

    const recordContentRef = useRef<HTMLElement>(null)

    useEffect(() => {
        document.activeElement === recordContentRef.current && setCaret()   
    })

    useEffect(() => {
        const { addedItemId, activeListName } = store
        if (activeListName === listName && addedItemId === id) {
            setContentEditable(true)
            setFocus()
            setCaret()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, store.addedItemId])

    const handleMouseDownOnCheckbox = () => {
        setIsDone((prevState) => item.isDone = !prevState)
    }

    const handleMouseUpOnCheckbox = () => updateRecord(item)

    const handleInput = debounceInput((text: string) => {
        item.text = text
        setCaretPos(getCaretPosition(recordContentRef.current || undefined))
        updateRecord(item)
    })

    const handleDelete = (e: any) => {
        e.stopPropagation() // prevent item selection ob click
        deleteRecord(item)
    }

    const setContentEditable = (flag: boolean) => {
        const el = recordContentRef.current
        el?.setAttribute('contenteditable', '' + flag)
        setCaret()
    }

    const handleBlur = () => {
        (useEditBtn || !isEditable) && setContentEditable(false)
    }

    const setCaret = () =>
        setCaretPosition(recordContentRef.current || undefined, caretPos)

    const setFocus = () => 
        recordContentRef.current?.focus()

    return (
        <div 
            className="record" 
            id={listName + ':' + id} 
            onClick={() => selectRecord(item)}
        >
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
