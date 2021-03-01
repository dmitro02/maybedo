import { useEffect, useState } from 'react'
import './Banner.scss'
import { MdClose } from 'react-icons/md'
import taskStore from '../../utils/Store'
import { IBanner } from '../../types'

const Banner = () => {
    const [ banner, setBanner ] = useState<IBanner | null>(null)

    const show = (banner: IBanner) => setBanner(banner)
    const hide = () => setBanner(null)

    useEffect(() => {
        taskStore.subscribe('showBanner', show)
        taskStore.subscribe('hideBanner', hide)

        return () => {
            taskStore.unsubscribe('showBanner', show)
            taskStore.unsubscribe('hideBanner', hide)
        }
    }, [])

    useEffect(() => {
        if (banner && banner.delay && banner.delay > 0) {
            setTimeout(hide, banner.delay * 1000)
        }
    }, [banner])

    if (!banner) return null

    const { text, type } = banner

    return (
        <div className={`banner banner-${type}`}>
            <div>{text}</div>
            <MdClose onClick={hide} />
        </div>
    )
}

export default Banner
