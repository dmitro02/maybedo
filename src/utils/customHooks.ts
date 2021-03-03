import { 
    MutableRefObject, 
    useEffect, 
    useState 
} from "react"

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

export const useForceUpdate = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [value, setValue] = useState(0)

    return () => setValue(value => value + 1)
}
