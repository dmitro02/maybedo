import { useEffect } from "react"

export enum Events {
    DeleteCompleted
}

class Store {
    private callbacks: Map<string | Events, ((value?: any) => void)[]> = new Map()

    subscribe(event: string | Events, callback: (value?: any) => void) {
        const cbks = this.callbacks.get(event)
        if (cbks) {
            cbks.push(callback)
        } else {
            this.callbacks.set(event, [callback])
        }
    }

    unsubscribe(event: string |Events, callback: (value?: any) => void) {
        const cbks = this.callbacks.get(event)
        if (cbks) {
            const newCbks = cbks.filter((it) => it !== callback)
            this.callbacks.set(event, newCbks)
        }
    }

    notify(event: string | Events, value?: any) {
        this.callbacks.get(event)?.forEach((cbk) => cbk(value))
    }
}

const store = new Store()

export default store

export const useSubscribe = (event: string | Events, callback: (data: any) => void) => {    
    useEffect(() => {
        store.subscribe(event, callback)

        return () => store.unsubscribe(event, callback)
    }, [callback, event])
}

export const actions = {
    deleteCompleted: (listId: string) => store.notify(Events.DeleteCompleted, listId)
}
