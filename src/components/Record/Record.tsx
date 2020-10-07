import React, { useState, useRef, useEffect, memo } from 'react'
import './Record.scss'
import { Task } from '../../types'
import { useTasksContext } from '../../contexts/TasksContext'
import { 
    debounceInput, 
    getCaretPosition,
    setCaretPosition
} from '../../utils/textInputUtils'
import {
    updateTaskAction,
    deleteTaskAction
} from '../../contexts/actionCreators'
import { isProjectLevelItem } from '../../utils/pathUtils'
import SubTaskList from '../SubTaskList/SubTaskList'
import { isMobile } from '../../utils/commonUtils'
import { 
    DeleteButton,
    ExpandButton,
    CollapseButton,
    AddButton,
    DragButton,
    CheckmarkButton,
    EmptyButton,
    ConfirmButton,
    CloseButton
 } from '../Buttons/Buttons'

export type RecordConfig = {
    useDragBtn?: boolean
    isEditable?: boolean
    isTitle?: boolean
}

const IS_MOBILE = isMobile()

type Props = { 
    item: Task, 
    config: RecordConfig, 
    parent: Task
}

const Record = ({ item, config, parent }: Props) => {
    const { isDone: initialState, text, path } = item
    
    const {
        useDragBtn = false,
        isEditable = false,
        isTitle = false
    } = config

    const [ isDone, setIsDone ] = useState(initialState)
    const [ 
        stateCaretPosition, 
        setStateCaretPosition
    ] = useState<number|undefined>(undefined)
    const [ showSubtasks, setShowSubtasks ] = useState(false)
    const [ showDeleteConfirmation, setShowDeleteConfirmation ] = useState(false)

    const [ store, dispatch ] = useTasksContext()

    const recordContentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        document.activeElement === recordContentRef.current && loadCaretPositionFromState()  
    })

    useEffect(() => {
        if (isJustAdded) {
            setContentEditable(true)
            setFocus()
            loadCaretPositionFromState()
            selectRecord(item)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [path, store.addedItemId])

    const updateRecord = (item: Task) => dispatch(updateTaskAction(item))

    const deleteRecord = (item: Task) => {
        console.log(item)
        if (isProjectLevelItem(item)) {
            if (parent.tasks.length === 1) {
                parent.selectedSubTaskPath = undefined
            } else if (item === parent.tasks[0]) {
                parent.selectedSubTaskPath = parent.tasks[1].path
            } else {
                parent.selectedSubTaskPath = parent.tasks[0].path
            }
            dispatch(updateTaskAction(parent))
        }
        setShowDeleteConfirmation(false)
        dispatch(deleteTaskAction(item))
    }

    const selectRecord = (item: Task) => {
        if (parent.selectedSubTaskPath === item.path) return
        parent.selectedSubTaskPath = item.path
        dispatch(updateTaskAction(parent))
    }

    const handleMouseDownOnCheckbox = (e: any) => {
        if (e.button === 0) { // left click only
            setIsDone((prevState) => item.isDone = !prevState)
        }
    }

    const handleMouseUpOnCheckbox = (e: any) => {
        if (e.button === 0) { // left click only
            updateRecord(item)
        }
    }
        
    const handleInput = debounceInput((text: string) => {
        item.text = text
        saveCaretPositionToState()
        updateRecord(item)
    })

    const openDeleteConfirmation = (e: any) => {
        e.stopPropagation() // prevent item selection ob click
        setShowDeleteConfirmation(true)
    }

    const closeDeleteConfirmation = (e: any) => {
        e.stopPropagation() // prevent item selection ob click
        setShowDeleteConfirmation(false)
    }

    const deleteRecordOnConfirm = (e: any) => {
        e.stopPropagation() // prevent item selection ob click
        deleteRecord(item);
    }

    const setContentEditable = (flag: boolean) => {
        const el = recordContentRef.current
        el?.setAttribute('contenteditable', '' + flag)
        loadCaretPositionFromState()
    }

    const saveCaretPositionToState = () => 
        setStateCaretPosition(getCaretPosition(recordContentRef.current || undefined))

    const loadCaretPositionFromState = () => 
        setCaretPosition(recordContentRef.current || undefined, stateCaretPosition)

    const handleBlur = () => !isEditable && setContentEditable(false)

    const setFocus = () => recordContentRef.current?.focus()

    const isJustAdded = store.addedItemPath === path && !isTitle

    const isSelected = path === parent.selectedSubTaskPath && !isTitle

    const hasSubtasks = !!item.tasks.length

    const recordClassName = `record${isSelected ? ' record-selected' : ''}\
        ${!isEditable ? ' read-only' : ''}${isTitle ? ' title' : ''}`

    const hiddenBtnClassName = IS_MOBILE 
        ? isSelected ? '' : ' mobile-hidden-btn'
        : ' hidden-btn' 

    const getSubtasksBtn = () => {
        const action = () => setShowSubtasks(!showSubtasks)
        const classNames = [ 'subtasks-btn' ]

        if (hasSubtasks && !showSubtasks) {
            return <ExpandButton action={action} classNames={classNames} />
        }
        if (showSubtasks) {
            return <CollapseButton action={action} classNames={classNames} />
        }
        if (!hasSubtasks && !(parent.isDone || isDone)) {
            return <AddButton action={action} classNames={[...classNames, hiddenBtnClassName]} />
        }

        return null
    }

    return (
        <>
            <div 
                className={recordClassName}
                id={path} 
                onClick={() => {
                    saveCaretPositionToState()
                    !isTitle && selectRecord(item)
                }}
            >
                <div className="record-btns">
                    {useDragBtn ? <DragButton /> : <EmptyButton />}
                    <CheckmarkButton 
                        actionOnMouseDown={handleMouseDownOnCheckbox} 
                        actionOnMouseUp={handleMouseUpOnCheckbox}
                        isChecked={isDone}
                    />
                </div>
                <div 
                    ref={recordContentRef}
                    className={'item-content' + (isDone ? ' item-done' : '')} 
                    contentEditable={isEditable}
                    suppressContentEditableWarning={true}
                    onInput={handleInput}
                    onBlur={handleBlur}
                >
                    {text}
                </div>
                <div className="record-btns">
                    {showDeleteConfirmation 
                        ?
                        <>
                            <ConfirmButton action={deleteRecordOnConfirm} />
                            <CloseButton action={closeDeleteConfirmation} />
                        </>
                        :
                        <>
                            {getSubtasksBtn()}
                            <DeleteButton 
                                classNames={[ hiddenBtnClassName ]} 
                                action={openDeleteConfirmation} 
                            />
                        </>
                    } 
                </div>
            </div>
            <SubTaskList task={item} isDisplayed={showSubtasks} />
        </>
    )
}

export default memo(Record)
