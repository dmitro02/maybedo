export type Callback = (value?: any) => void
// type Data = {[key: string]: any}

export default class Observer {
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