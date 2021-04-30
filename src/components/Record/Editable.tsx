import { useRef, useEffect } from 'react'

type Props = { 
    text: string, 
    isEditable: boolean,
    saveContent: (text: string) => void,
    getFocus?: boolean, 
    isSingleLine?: boolean,
    classes?: string[]
}

const Editable = (props: Props) => {
    const {
        text,
        isEditable,
        saveContent,
        getFocus = false,
        isSingleLine = false,
        classes = []
    } = props

    const editableRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (editableRef.current) editableRef.current.innerHTML = text
    })

    useEffect(() => {
        if (getFocus) {        
            setContentEditable(true)
            editableRef.current?.focus()
            setCaretPosition(editableRef.current, text.length)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const setContentEditable = (flag: boolean) => {
        const el = editableRef.current
        el?.setAttribute('contenteditable', '' + flag)
    }

    const handleInput = debounceInput(saveContent)

    const handleBlur = (e: any) => {
        saveContent(e.target.innerHTML)
        !isEditable && setContentEditable(false)
    }

    const preserveSingleLine = (e: any) => {
        isSingleLine && e.key === 'Enter' && e.preventDefault()
    }

    const classNames = [ 
        ...classes,
        isEditable ? '' : 'read-only'
    ].join(' ')

    return (
        <div 
            ref={editableRef}
            className={classNames}
            contentEditable={isEditable}
            suppressContentEditableWarning={true}
            onInput={handleInput}
            onBlur={handleBlur}
            onKeyPress={preserveSingleLine}
        />
    )
}

const debounceInput = (callback: (text: string) => void) => {
    let timeout: any
    return (e: any) => {
        const text = e.target.innerHTML
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
}

export default Editable
