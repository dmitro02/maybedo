export const debounceInput = (callback: Function) => {
    let timeout: any
    return (e: any) => {
        const text = e.target.innerText
        clearTimeout(timeout)
        timeout = setTimeout(() => callback(text), 700)
    }
}

export const getCaretPosition = (el?: HTMLElement) => {
    if (!el) return
    let _range = document.getSelection()?.getRangeAt(0)
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
    range.setStart(elContentNode, pos || elContentNode.textContent.length)
    range.collapse()
    selection?.removeAllRanges()
    selection?.addRange(range)
}

export const generateNextId = (items: any[]) => (items && items.length) 
    ? items
        .map((item) => item.id)
        .reduce((prev, curr) => Math.max(prev, curr)) + 1
    : 1


export const updateObject = (oldObject: any, newValues: any) => {
    return Object.assign({}, oldObject, newValues)
}

export const updateArrayItem = 
    (array: any[], itemId: number, updateItemCallback: Function) => {
        return array.map((item: any) => 
            item.id !== itemId ? item : updateItemCallback(item))
}