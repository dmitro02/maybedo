import { SyncStatuses } from '../components/Statuses/SyncStatus';
import { IBanner } from '../components/Banner/Banner';
import { useEffect } from "react"
import { useForceUpdate } from "../utils/customHooks"

export enum Events {
    ShowLoading,
    HideLoading,
    ShowBanner,
    SetSyncStatus,
    Reload,
    UpdateTitle,
    SelectProject
}

class Notifier {
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

    notifyWithDelay(event: string | Events, value?: any) {
        setTimeout(() => this.notify(event, value), 0)
    }
}

const notifier = new Notifier()

export default notifier

export const useSubscribe = (event: string | Events, callback: (data: any) => void) => {    
    useEffect(() => {
        notifier.subscribe(event, callback)

        return () => notifier.unsubscribe(event, callback)
    }, [callback, event])
}

export const useSubscribeWithForceUpdate = (event: string | Events) => {    
    const forceUpdate = useForceUpdate()

    useEffect(() => {
        notifier.subscribe(event, forceUpdate)

        return () => notifier.unsubscribe(event, forceUpdate)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [event])
}

export const actions = {
    showLoading: () => notifier.notify(Events.ShowLoading),
    hideLoading: () => notifier.notify(Events.HideLoading),
    showBanner: (banner: IBanner) => notifier.notify(Events.ShowBanner, banner),
    setSyncStatus: (status: SyncStatuses) => notifier.notify(Events.SetSyncStatus, status),
    reload: () => notifier.notify(Events.Reload)
}
