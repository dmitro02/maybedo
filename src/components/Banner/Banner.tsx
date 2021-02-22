import { useCallback, useEffect } from 'react'
import './Banner.scss'
import { useTasksContext } from '../../contexts/TasksContext'
import { MdClose } from 'react-icons/md'

const Banner = () => {
    const { store: { banner } , actions } = useTasksContext()

    const closeBanner = useCallback(() => actions.setBanner(null), [actions])

    useEffect(() => {
        if (banner && banner.delay && banner.delay > 0) {
            setTimeout(closeBanner, banner.delay * 1000)
        }
    }, [banner, closeBanner])

    if (!banner) return null

    const { text, type } = banner

    return (
        <div className={`banner banner-${type}`}>
            <div>{text}</div>
            <MdClose onClick={closeBanner} />
        </div>
    )
}

export default Banner