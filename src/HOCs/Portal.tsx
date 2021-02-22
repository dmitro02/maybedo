import { useEffect } from "react"
import { createPortal } from "react-dom"

type Props = { children: any }

const Portal = ({ children }: Props) => {
  const mountPoint = document.getElementById("portal-root")
  const el = document.createElement("div")

  useEffect(() => {
    mountPoint!.appendChild(el)

    return () => {
        mountPoint!.removeChild(el)
    }
  }, [el, mountPoint])

  return createPortal(children, el)
};

export default Portal