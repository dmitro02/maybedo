export const isMobile = () => {
    if (navigator.maxTouchPoints) return navigator.maxTouchPoints > 0
    if (navigator.msMaxTouchPoints) return navigator.msMaxTouchPoints > 0

    const mQ = window.matchMedia && matchMedia("(pointer:coarse)")
    if (mQ && mQ.media === "(pointer:coarse)") return !!mQ.matches

    if ('orientation' in window) return true

    return (/\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(navigator.userAgent) ||
            /\b(Android|Windows Phone|iPad|iPod)\b/i.test(navigator.userAgent))
}

export const readFile = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const fr = new FileReader()
        fr.onerror = reject
        fr.onload = () => resolve(fr.result as string)
        fr.readAsText(blob)
    })
}

export const generateId = (length: number = 10): string => {
    let id = ''
    while (id.length < length) {
        id += Math.floor(Math.random() * 1E10).toString()
    }
    return id.substring(0, length)
}
