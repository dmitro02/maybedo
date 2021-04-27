import { useRef, useEffect } from 'react'

type Props = { 
    text: string, 
    isEditable: boolean,
    update: (text: string) => void,
    getFocus?: boolean
}

const Editable = (props: Props) => {
    const {
        text,
        isEditable,
        update,
        getFocus = false
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

    const handleInput = debounceInput(update)

    const handleBlur = () => !isEditable && setContentEditable(false)

    return (
        <div 
            ref={editableRef}
            className="item-content"
            contentEditable={isEditable}
            suppressContentEditableWarning={true}
            onInput={handleInput}
            onBlur={handleBlur}
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
