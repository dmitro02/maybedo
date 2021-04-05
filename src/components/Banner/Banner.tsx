import { useEffect, useState } from 'react'
import './Banner.scss'
import { MdClose } from 'react-icons/md'
import { Events, useSubscribe } from '../../classes/Notifier'

const Banner = () => {
    const [ banner, setBanner ] = useState<IBanner | null>(null)

    const show = (banner: IBanner) => setBanner(banner)
    const hide = () => setBanner(null)

    useSubscribe(Events.ShowBanner, show)

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

export interface IBanner {
    text: string
    type: BannerTypes
    delay?: number
}

export enum BannerTypes {
    Success = "success",
    Warning = "warning",
    Failure = "failure"
}

export class FailureBanner implements IBanner {
    text: string
    type: BannerTypes

    constructor(text: string) {
        this.text = text
        this.type = BannerTypes.Failure
    }
}

export class SuccessBanner implements IBanner {
    text: string
    type: BannerTypes
    delay: number

    constructor(text: string, delay: number = 5) {
        this.text = text
        this.type = BannerTypes.Success
        this.delay = delay
    }
}
