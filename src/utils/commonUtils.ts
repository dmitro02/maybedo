export const isMobile = () => {
    if (navigator.maxTouchPoints) return navigator.maxTouchPoints > 0
    if (navigator.msMaxTouchPoints) return navigator.msMaxTouchPoints > 0

    const mQ = window.matchMedia && matchMedia("(pointer:coarse)")
    if (mQ && mQ.media === "(pointer:coarse)") return !!mQ.matches

    if ('orientation' in window) return true

    return (/\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(navigator.userAgent) ||
            /\b(Android|Windows Phone|iPad|iPod)\b/i.test(navigator.userAgent))
}
