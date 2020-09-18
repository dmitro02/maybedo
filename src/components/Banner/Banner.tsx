import React from 'react'
import './Banner.scss'

export enum BannerTypes {
    Success = "success",
    Warning = "warning",
    Failure = "failure"
}

type Props = {
    type: BannerTypes
    text: string
}

const Banner = (props: Props) => {
    const {
        type,
        text
    } = props

    return (
        <div className={`banner banner-${type}`}>
            {text}
        </div>
    )
}

export default Banner