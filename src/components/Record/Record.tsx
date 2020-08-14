import React, { useState, useRef, useEffect, memo } from 'react'
import './Record.scss'
import { ITask } from '../../types'
import { useTasksContext } from '../../contexts/TasksContext'
import { 
    debounceInput, 
    getCaretPosition,
    setCaretPosition
} from '../../utils'

export type RecordConfig = {
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
    actions: RecordActions,
    isSelected?: boolean,
    listPath?: string
}

const Record = ({ item, config, actions, isSelected = false, listPath }: Props) => {
    const { isDone: initialState, text, path } = item
    
    useEffect(() => {
        console.log('RENDER RECORD - ' + item.path)
    })
    useEffect(() => console.log('item'), [item])
    useEffect(() => console.log('config'), [config])
    useEffect(() => console.log('actions'), [actions])
    useEffect(() => console.log('isSelected'), [isSelected])
    useEffect(() => console.log('listPath'), [listPath])

    const {
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
        if (isJustAddedRecord()) {
            setContentEditable(true)
            setFocus()
            setCaret()
            selectRecord(item)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [path, store.addedItemId])

    const isJustAddedRecord = () =>
        store.addedItemPath === path && !!listPath && path.startsWith(listPath)

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

    const setFocus = () => recordContentRef.current?.focus()

    return (
        <div 
            className={`record ${isSelected ? 'record-selected' : ''}`} 
            id={path} 
            onClick={() => {
                setCaretPos(getCaretPosition(recordContentRef.current || undefined))
                selectRecord(item)
            }}
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

export default memo(Record)
