export const debounceInput = (callback: Function) => {
    let timeout: any
    return (e: any) => {
        const text = e.target.innerText
        clearTimeout(timeout)
        timeout = setTimeout(() => callback(text), 700)
    }
}

export const getCaretPosition = (el?: HTMLElement) => {
    if (!el || !el.isContentEditable) return
    let _range
    try {
        _range = document.getSelection()?.getRangeAt(0)
    } catch(err) {
        console.log(err)
    }
    if (!_range) return
    let range = _range.cloneRange()
    range.selectNodeContents(el)
    range.setEnd(_range.endContainer, _range.endOffset)
    return range.toString().length;
}

export const setCaretPosition = (el?: HTMLElement, pos?: number) => {
    if (!el) return
    const range = document.createRange()
    const selection = window.getSelection()
    const elContentNode = el.childNodes[0]
    if (!elContentNode || !elContentNode.textContent) return
    const textLength = elContentNode.textContent.length
    const positionNormalized = pos ? Math.min(pos, textLength) : textLength
    range.setStart(elContentNode, positionNormalized)
    range.collapse()
    selection?.removeAllRanges()
    selection?.addRange(range)
}
