export const debounceInput = (callback: Function) => {
    let timeout: any
    return (e: any) => {
        const text = e.target.textContent
        clearTimeout(timeout)
        timeout = setTimeout(() => callback(text), 700)
    }
}