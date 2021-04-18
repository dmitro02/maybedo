import { SyncStatuses } from '../components/Statuses/SyncStatus';
import { IBanner } from '../components/Banner/Banner';
import { useEffect } from "react"

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
}

const notifier = new Notifier()

export default notifier

export const useSubscribe = (event: string | Events, callback: (data: any) => void) => {    
    useEffect(() => {
        notifier.subscribe(event, callback)

        return () => notifier.unsubscribe(event, callback)
    }, [callback, event])
}

export const actions = {
    showLoading: () => notifier.notify(Events.ShowLoading),
    hideLoading: () => notifier.notify(Events.HideLoading),
    showBanner: (banner: IBanner) => notifier.notify(Events.ShowBanner, banner),
    setSyncStatus: (status: SyncStatuses) => notifier.notify(Events.SetSyncStatus, status),
    selectProject: (projectId: string) => notifier.notify(Events.SelectProject, projectId),
    updateTitle: (data: { id: string, text: string }) => notifier.notify(Events.UpdateTitle, data)
}
