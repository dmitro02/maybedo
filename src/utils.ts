export const debounceInput = (callback: Function) => {
    let timeout: any
    return (e: any) => {
        const text = e.target.textContent
        clearTimeout(timeout)
        timeout = setTimeout(() => callback(text), 700)
    }
}

// https://gist.github.com/islishude/6ccd1fbf42d1eaac667d6873e7b134f8}
const getCaretPosition = (e: any) => {
    let _range = document.getSelection()?.getRangeAt(0)
    if (!_range) return
    let range = _range.cloneRange()
    range.selectNodeContents(e.target)
    range.setEnd(_range.endContainer, _range.endOffset)
    return range.toString().length;
}

const setCaretPosition = (el: HTMLElement, pos: number) => {
    el.focus()
    document.getSelection()?.collapse(el, pos)
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

export const updateArrayItem = 
    (array: any[], itemId: number, updateItemCallback: Function) => {
        return array.map((item: any) => 
            item.id !== itemId ? item : updateItemCallback(item))
}