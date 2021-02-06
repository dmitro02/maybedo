import { useRef, useEffect, memo } from 'react'
import { Task } from '../../types'

type Props = { 
    task: Task, 
    isEditable: boolean
}

const Editable = ({ task, isEditable }: Props) => {
    const { isNew, text } = task

    const editableRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isNew) {            
            setContentEditable(true)
            setCaretPosition(editableRef.current, text.length)
            task.isNew = false
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
        
    const setContentEditable = (flag: boolean) => {
        const el = editableRef.current
        el?.setAttribute('contenteditable', '' + flag)
    }

    const handleInput = debounceInput((text: string) => {
        task.text = text
    })

    return (
        <div 
            ref={editableRef}
            className="item-content"
            contentEditable={isEditable}
            suppressContentEditableWarning={true}
            onInput={handleInput}
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
    el.focus()
}

export default memo(Editable)
