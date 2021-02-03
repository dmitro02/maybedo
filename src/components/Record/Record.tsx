import React, { 
    useState, 
    useRef, 
    useEffect, 
    memo 
} from 'react'
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
    ExpandButton,
    CollapseButton,
    CheckmarkButton
 } from '../Buttons/Buttons'
 import taskStore from '../../utils/taskStore'
import RecordMenu from '../RecordMenu/RecordMenu'

export type RecordConfig = {
    isEditable?: boolean
    isTitle?: boolean
    isProject?: boolean
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
        isTitle = false,
        isProject = false
    } = config

    const [ isDone, setIsDone ] = useState(initialState)

    const [ 
        stateCaretPosition, 
        setStateCaretPosition
    ] = useState<number|undefined>(undefined)

    const [ showSubtasks, setShowSubtasks ] = useState(false)
    
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

    const selectRecord = (item: Task) => {   
        if (parent && parent.selectedSubTaskId === id) return
        saveCaretPositionToState()
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
            actions.triggerCascadingUpdate()
        }
    }
        
    const handleInput = debounceInput((text: string) => {
        item.text = text
        saveCaretPositionToState()
    })

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

    const openSubtasks = () => setShowSubtasks(true)
    const closeSubtasks = () => setShowSubtasks(false)

    const getSubtasksBtn = () => {
        const classNames = [ 'subtasks-btn' ]
        if (hasSubtasks && !showSubtasks) {
            return <ExpandButton action={openSubtasks} classNames={classNames} />
        }
        if (showSubtasks) {
            return <CollapseButton action={closeSubtasks} classNames={classNames} />
        }
        return null
    }

    return (
        <>
            <div 
                className={recordClassName}
                id={id} 
                onClick={() => {
                    !isTitle && selectRecord(item)
                    isProject && actions.setShowSidebar(false)
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
                    {getSubtasksBtn()}
                    <RecordMenu 
                        task={item} 
                        actions={actions}
                        showSubtasks={() => setShowSubtasks(true)}
                        classes={[ hiddenBtnClassName ]}
                        isProject={isProject}
                    /> 
                </div>
            </div>
            <SubTaskList task={item} isDisplayed={showSubtasks} />
        </>
    )
}

export default memo(Record)
