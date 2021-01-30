import { MutableRefObject, useEffect } from "react"

export const useOutsideClickDetector = (
    ref: MutableRefObject<HTMLElement | null>, 
    action: Function, 
    isEnabled: boolean = true) => 
{
    useEffect(() => {
        if (!isEnabled) return

        const handleClickOutside = (e: any) => {
            if (ref.current && !ref.current.contains(e.target)) {
                action()
            }
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [action, isEnabled, ref])
}