import { useEffect, useState } from 'react'

export const createStore = <T extends object>(initialValue: T) => {
    type Callback = (value?: any) => void
    type Property = keyof typeof initialValue
    type StoreData = typeof initialValue

    const subsciptions: Map<Property | string, Callback[]> = new Map()
    
    const subscribe = (property: string, callback: Callback) => {
        const callbacks = subsciptions.get(property)
        callbacks
            ? callbacks.push(callback)
            : subsciptions.set(property, [callback])
    }

    const unsubscribe = (property: string, callback: Callback) => {
        const callbacks = subsciptions.get(property)
        if (callbacks) {
            const newCallbacks = callbacks.filter((it) => it !== callback)
            subsciptions.set(property as string, newCallbacks)
        }
    }

    const notify = (property: Property | string, value?: any) => {
        subsciptions.get(property)?.forEach((callback) => callback(value))
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

    const useSubscribe = (eventOrProperty: Property | string, callback: Callback) => {  
        useEffect(() => {
            subscribe(eventOrProperty as string, callback)
            return () => unsubscribe(eventOrProperty as string, callback)
        }, [callback, eventOrProperty])
    }

    const useEvent = (eventName: string, callback: Callback): (v: any) => void => {  
        useSubscribe(eventName, callback)
        return (value: any) => notify(eventName, value)
    }

    const useEventWithState = (eventName: string, callback?: Callback): [any, (v: any) => void] => {  
        const [ state, setState ] = useState()
    
        const onNotify = (value: any) => {
            callback && callback(value)
            setState(value)
        }
        useEvent(eventName, onNotify)
    
        return [ state, (value: any) => notify(eventName, value) ]
    }

    const useProperty = (property: Property, callback: Callback) => { 
        useSubscribe(property, callback)
    
        return (value: any) => store[property] = value
    }
    
    const usePropertyWithState = (property: Property, callback?: Callback): [any, (v: any) => void] => {  
        const [ state, setState ] = useState(store[property])
    
        const onNotify = (value: any) => {
            callback && callback(value)
            setState(value)
        }
        useProperty(property, onNotify)
    
        return [ state, (value: any) => store[property] = value ]
    }

    return {
        store,
        notify,
        useSubscribe,
        useEvent,
        useEventWithState,
        useProperty,
        usePropertyWithState
    }
}
