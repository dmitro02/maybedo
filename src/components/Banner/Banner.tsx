import { useEffect, useState } from 'react'
import './Banner.scss'
import { MdClose } from 'react-icons/md'
import taskStore from '../../utils/Store'
import { IBanner } from '../../types'

type BannerState = {
    isDiplayed: boolean,
    content?: IBanner
}

const Banner = () => {
    // const { store: { banner } , actions } = useTasksContext()

    const initState: BannerState = { isDiplayed: false }

    const [ banner, setBanner ] = useState(initState)

    const show = (content: IBanner) => setBanner({ isDiplayed: true, content })
    const hide = () => setBanner({ isDiplayed: false })

    const { isDiplayed, content } = banner

    useEffect(() => {
        taskStore.subscribe('showBanner', show)
        taskStore.subscribe('hideBanner', hide)

        return () => {
            taskStore.unsubscribe('showBanner', show)
            taskStore.unsubscribe('hideBanner', hide)
        }
    }, [])

    useEffect(() => {
        if (content && content.delay && content.delay > 0) {
            setTimeout(hide, content.delay * 1000)
        }
    }, [])

    if (!isDiplayed || !content) return null

    const { text, type } = content

    return (
        <div className={`banner banner-${type}`}>
            <div>{text}</div>
            <MdClose onClick={hide} />
        </div>
    )
}

export default Banner