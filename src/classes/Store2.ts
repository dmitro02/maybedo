import { useEffect, useState } from 'react'
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

type Callback = (value?: any) => void

class Observer {
    data: any

    constructor(initialValue: any) {
        this.data = this.toProxy(initialValue)
    }

    private subsciptions: Map<string, Callback[]> = new Map()

    subscribe (property: string, callback: Callback) {
        const callbacks = this.subsciptions.get(property)
        callbacks
            ? callbacks.push(callback)
            : this.subsciptions.set(property, [callback])
    }

    unsubscribe (property: string, callback: Callback) {
        const callbacks = this.subsciptions.get(property)
        if (callbacks) {
            const newCallbacks = callbacks.filter((it) => it !== callback)
            this.subsciptions.set(property, newCallbacks)
        }
    }

    notify (property: string, value: any) {
        this.subsciptions.get(property)?.forEach((callback) => callback(value))
    }

    toProxy (obj: any) {
        const proxyHandler = {
            set: (target: any, property: string, value: any) => {
                target[property] = value
                this.notify(property, value)
                return true
            },
            get: (target: any, property: string) => {
                return target[property]
            }
        }
        return new Proxy(obj, proxyHandler)
    }
}

const observer = new Observer(initialValue)

export const store: StoreData = observer.data

export const triggerEvent = (eventName: string, eventData?: any) => {
    observer.notify(eventName, eventData)
}

export const setProperty = (property: Property, value: any) => {
    observer.data[property] = value
}

export const useSubscribe = (eventOrProperty: Property | string, callback: Callback) => {  
    useEffect(() => {
        observer.subscribe(eventOrProperty, callback)
        return () => observer.unsubscribe(eventOrProperty, callback)
    }, [callback, eventOrProperty])
}

export const useEvent = (eventName: string, callback: Callback) => {  
    useSubscribe(eventName, callback)

    return (value: any) => triggerEvent(eventName, value)
}

export const useEventWithState = (eventName: string, callback?: Callback) => {  
    const [ state, setState ] = useState()

    const onNotify = (value: any) => {
        callback && callback(value)
        setState(value)
    }
    useEvent(eventName, onNotify)

    return [ state, (value: any) => triggerEvent(eventName, value) ]
}

export const useProperty = (property: Property, callback: Callback) => { 
    useSubscribe(property, callback)

    return (value: any) => setProperty(property, value)
}

export const usePropertyWithState = (property: Property, callback?: Callback) => {  
    const [ state, setState ] = useState(observer.data[property])

    const onNotify = (value: any) => {
        callback && callback(value)
        setState(value)
    }
    useProperty(property, onNotify)

    return [ state, (value: any) => setProperty(property, value) ]
}
