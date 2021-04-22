import { useEffect, useState } from 'react'

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
            this.subsciptions.set(property as string, newCallbacks)
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

export const createStore = <T extends object>(initialValue: T) => {
    type Property = keyof typeof initialValue
    type StoreData = typeof initialValue
    
    const observer = new Observer(initialValue)

    const store: StoreData = observer.data

    const triggerEvent = (eventName: string, eventData?: any) => {
        observer.notify(eventName, eventData)
    }
    
    const setProperty = (property: Property, value: any) => {
        observer.data[property] = value
    }

    const useSubscribe = (eventOrProperty: Property | string, callback: Callback) => {  
        useEffect(() => {
            observer.subscribe(eventOrProperty as string, callback)
            return () => observer.unsubscribe(eventOrProperty as string, callback)
        }, [callback, eventOrProperty])
    }

    const useEvent = (eventName: string, callback: Callback) => {  
        useSubscribe(eventName, callback)
        return (value: any) => triggerEvent(eventName, value)
    }

    const useEventWithState = (eventName: string, callback?: Callback) => {  
        const [ state, setState ] = useState()
    
        const onNotify = (value: any) => {
            callback && callback(value)
            setState(value)
        }
        useEvent(eventName, onNotify)
    
        return [ state, (value: any) => triggerEvent(eventName, value) ]
    }

    const useProperty = (property: Property, callback: Callback) => { 
        useSubscribe(property, callback)
    
        return (value: any) => setProperty(property, value)
    }
    
    const usePropertyWithState = (property: Property, callback?: Callback) => {  
        const [ state, setState ] = useState(observer.data[property])
    
        const onNotify = (value: any) => {
            callback && callback(value)
            setState(value)
        }
        useProperty(property, onNotify)
    
        return [ state, (value: any) => setProperty(property, value) ]
    }

    return {
        store,
        triggerEvent,
        setProperty,
        useSubscribe,
        useEvent,
        useEventWithState,
        useProperty,
        usePropertyWithState
    }
}
