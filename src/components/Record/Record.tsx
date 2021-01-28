import React, { useState, useRef, useEffect, memo } from 'react'
import './Record.scss'
import { Task } from '../../types'
import { useTasksContext } from '../../contexts/TasksContext'
import { 
    debounceInput, 
    getCaretPosition,
    setCaretPosition
} from '../../utils/textInputUtils'
import SubTaskList from '../SubTaskList/SubTaskList'
import { isMobile } from '../../utils/commonUtils'
import { 
    DeleteButton,
    ExpandButton,
    CollapseButton,
    AddButton,
    CheckmarkButton,
    ConfirmButton,
    CloseButton
 } from '../Buttons/Buttons'
 import taskStore from '../../utils/taskStore'

export type RecordConfig = {
    isEditable?: boolean
    isTitle?: boolean
}

const IS_MOBILE = isMobile()

type Props = { 
    item: Task, 
    config?: RecordConfig, 
}

const Record = ({ item, config = {}}: Props) => {
    const {
        id, 
        isDone: initialState, 
        text, 
        isNew, 
        parent 
    } = item
    
    const {
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

    const { actions } = useTasksContext()

    const recordContentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        document.activeElement === recordContentRef.current && loadCaretPositionFromState()  
    })

    useEffect(() => {
        if (isNew) {            
            setContentEditable(true)
            setFocus()
            loadCaretPositionFromState()
            item.isNew = false
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const updateRecord = () => actions.triggerCascadingUpdate()

    const deleteRecord = (item: Task) => {
        setShowDeleteConfirmation(false)
        taskStore.deleteTask(item)
        actions.triggerCascadingUpdate()
    }

    const selectRecord = (item: Task) => {   
        if (parent && parent.selectedSubTaskId === id) return
        taskStore.selectTask(item)
        actions.triggerCascadingUpdate()
    }

    const handleMouseDownOnCheckbox = (e: any) => {
        if (e.button === 0) { // left click only
            setIsDone((prevState) => item.isDone = !prevState)
        }
    }

    const handleMouseUpOnCheckbox = (e: any) => {
        if (e.button === 0) { // left click only
            updateRecord()
        }
    }
        
    const handleInput = debounceInput((text: string) => {
        item.text = text
        saveCaretPositionToState()
        updateRecord()
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

    const isSelected = parent && id === parent.selectedSubTaskId && !isTitle

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
        if (parent && !hasSubtasks && !(parent!.isDone || isDone)) {
            return <AddButton 
                        action={action} 
                        classNames={[...classNames, hiddenBtnClassName]}
                        title='add subtask'
                    />
        }

        return null
    }

    return (
        <>
            <div 
                className={recordClassName}
                id={id} 
                onClick={() => {
                    saveCaretPositionToState()
                    if (!isTitle) {
                        selectRecord(item)
                        actions.setShowSidebar(false)
                    }
                }}
            >
                <div className="row-btns">
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
                <div className="row-btns">
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
