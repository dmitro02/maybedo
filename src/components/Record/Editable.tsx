import { useRef, useEffect } from 'react'
import { Task } from '../../types'

type Props = { 
    task: Task, 
    isEditable: boolean,
    isProject: boolean,
}

const Editable = ({ task, isEditable, isProject }: Props) => {
    const { isNew, text } = task

    const editableRef = useRef<HTMLDivElement>(null)

    const caretPosRef = useRef<number | undefined>(undefined)

    useEffect(() => {
        if (isNew) {            
            setContentEditable(true)
            setCaretPosition(editableRef.current, text.length)
            task.isNew = false
            editableRef.current?.focus()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (document.activeElement === editableRef.current) {
            setCaretPosition(editableRef.current, caretPosRef.current)
        }
    })
        
    const setContentEditable = (flag: boolean) => {
        const el = editableRef.current
        el?.setAttribute('contenteditable', '' + flag)
    }

    const handleInput = debounceInput((text: string) => {
        task.text = text
        caretPosRef.current = getCaretPosition(editableRef.current)
    })

    const handleBlur = () => {
        !isEditable && setContentEditable(false)
    }

    return (
        <div 
            ref={editableRef}
            className="item-content"
            contentEditable={isEditable}
            suppressContentEditableWarning={true}
            onInput={handleInput}
            onBlur={handleBlur}
        >
            {text}
        </div>
    )
}

const debounceInput = (callback: (text: string) => void) => {
    let timeout: any
    return (e: any) => {
        const text = e.target.innerText
        clearTimeout(timeout)
        timeout = setTimeout(() => callback(text), 700)
    }
}

const getCaretPosition = (el: HTMLElement | null): number | undefined => {
    if (!el || !el.isContentEditable) return
    let range
    try {
        range = document.getSelection()?.getRangeAt(0)
    } catch(err) {
        // do nothing
    }
    if (!range) return
    let rangeClone = range.cloneRange()
    rangeClone.selectNodeContents(el)
    rangeClone.setEnd(range.endContainer, range.endOffset)
    return rangeClone.toString().length
}

const setCaretPosition = (el: HTMLElement | null, pos?: number): void => {
    if (!el) return
    const range = document.createRange()
    const selection = window.getSelection()
    const elContentNode = el.childNodes[0]
    if (!elContentNode || !elContentNode.textContent) return
    const textLength = elContentNode.textContent.length
    const positionNormalized = pos !== undefined 
        ? Math.min(pos, textLength) 
        : textLength
    range.setStart(elContentNode, positionNormalized)
    range.collapse()
    selection?.removeAllRanges()
    selection?.addRange(range)
}

export default Editable
