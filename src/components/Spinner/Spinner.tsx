// https://loading.io/css/

import React from 'react'
import './Spinner.scss'

const Spinner = () => {

    const className = 'type1'

    return (
        <div className="lds-ring">
            <div className={className} />
            <div className={className} />
            <div className={className} />
            <div className={className} />
        </div>
    )
}

export default Spinner