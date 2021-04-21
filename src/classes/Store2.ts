import { useEffect, useState } from 'react'
import Observer, { Callback } from './Observer'
import * as lsUtils from "../utils/localStorageUtils"
import { getProjectsList, initRoot } from '../utils/taskService'
import metadata from './Metadata'
import { SyncStatuses } from '../components/Statuses/SyncStatus'
import { IBanner } from '../components/Banner/Banner'

metadata.init()
initRoot()

type StoreData = {
    selectedProjectId: string,
    showLoading: boolean,
    banner: IBanner | null,
    syncStatus: SyncStatuses
}

const initSelectProjectId =
    lsUtils.getSelectedProjectId()
    || getProjectsList()[0]?.id 
    || ''

const initialValue: StoreData = {
    selectedProjectId: initSelectProjectId,
    showLoading: false,
    banner: null,
    syncStatus: SyncStatuses.NotConfigured
}

type Property = keyof typeof initialValue
type Store = typeof initialValue

const observer = new Observer(initialValue)

export const store: Store = observer.data

export const useSubscribe = (property: Property, callback?: Callback) => {  
    const [ state, setState ] = useState(observer.data[property])

    useEffect(() => {
        const onNotify = (value: any) => {
            callback && callback(value)
            setState(value)
        }
        observer.subscribe(property, onNotify)
        return () => observer.unsubscribe(property, onNotify)
    }, [callback, property])

    return state
}
