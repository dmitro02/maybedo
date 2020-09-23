export const debounceInput = (callback: (text: string) => void) => {
    let timeout: any
    return (e: any) => {
        const text = e.target.innerText
        clearTimeout(timeout)
        timeout = setTimeout(() => callback(text), 700)
    }
}

export const getCaretPosition = (el?: HTMLElement): number | undefined => {
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

export const setCaretPosition = (el?: HTMLElement, pos?: number): void => {
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
