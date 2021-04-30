import { useEffect, useState } from 'react'

export const createStore = <T extends object>(initialValue: T) => {
    type Callback = (value?: any) => void
    type Property = keyof typeof initialValue
    type StoreData = typeof initialValue

    const subsciptions: Map<string, Callback[]> = new Map()
    
    const subscribe = (eventOrProperty: string, callback: Callback) => {
        const callbacks = subsciptions.get(eventOrProperty)
        callbacks
            ? callbacks.push(callback)
            : subsciptions.set(eventOrProperty, [callback])
    }

    const unsubscribe = (eventOrProperty: string, callback: Callback) => {
        const callbacks = subsciptions.get(eventOrProperty)
        if (callbacks) {
            const newCallbacks = callbacks.filter((it) => it !== callback)
            subsciptions.set(eventOrProperty as string, newCallbacks)
        }
    }

    const notify = (eventOrProperty: string, value?: any) => {
        subsciptions.get(eventOrProperty)?.forEach((callback) => callback(value))
    }

    const toProxy = (obj: StoreData):  StoreData => {
        const proxyHandler = {
            set: (target: any, property: string, value: any) => {
                target[property] = value
                notify(property, value)
                return true
            },
            get: (target: any, property: string) => {
                return target[property]
            }
        }
        return new Proxy(obj, proxyHandler)
    }

    const store: StoreData = toProxy(initialValue)

    const useSubscribe = (eventOrProperty: string, callback: Callback) => {  
        useEffect(() => {
            subscribe(eventOrProperty, callback)
            return () => unsubscribe(eventOrProperty, callback)
        }, [callback, eventOrProperty])
    }

    const useEvent = (eventName: string, callback: Callback): Callback => {  
        useSubscribe(eventName, callback)
        return (value: any) => notify(eventName, value)
    }

    const useProperty = (property: Property, callback: Callback) => { 
        useSubscribe(property as string, callback)
    
        return (value: any) => store[property] = value
    }
    
    const usePropertyWithState = (property: Property, callback?: Callback): [any, Callback] => {  
        const [ state, setState ] = useState(store[property])
    
        const onNotify = (value: any) => {
            callback && callback(value)
            setState(value)
        }
        useProperty(property, onNotify)
    
        return [ state, (value: any) => store[property] = value ]
    }

    const useReload = (callback: Callback) => {
        const [ , setState ] = useState({})

        const onNotify = () => {
            callback && callback()
            setState({})
        }
        
        useEvent('reload', onNotify)
    }

    const reload = () => notify('reload')

    return {
        store,
        notify,
        useSubscribe,
        useEvent,
        useProperty,
        usePropertyWithState,
        useReload,
        reload
    }
}
