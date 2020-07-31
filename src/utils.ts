export const debounceInput = (callback: Function) => {
    let timeout: any
    return (e: any) => {
        const text = e.target.textContent
        clearTimeout(timeout)
        timeout = setTimeout(() => callback(text), 700)
    }
}

export const moveCaretToEndAndFocus = (el: HTMLElement) => {
    const range = document.createRange()
    const selection = window.getSelection()
    const elContentNode = el.childNodes[0]
    if (!elContentNode || !elContentNode.textContent) return
    range.setStart(elContentNode, elContentNode.textContent.length)
    range.collapse()
    selection?.removeAllRanges()
    selection?.addRange(range)
    el.focus()
}

export const generateNextId = (items: any[]) => items
    .map((item) => item.id)
    .reduce((prev, curr) => Math.max(prev, curr)) + 1

export const updateObject = (oldObject: any, newValues: any) => {
    return Object.assign({}, oldObject, newValues)
}

export const updateArray = 
    (array: any[], itemId: number, updateItemCallback: Function) => {
        return array.map((item: any) => 
            item.id !== itemId ? item : updateItemCallback(item))
}