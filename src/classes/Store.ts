import { SyncStatuses } from '../components/Statuses/SyncStatus';
import { IBanner } from '../components/Banner/Banner';
import { useEffect } from "react"
import * as lsUtils from '../utils/localStorageUtils'

export enum Events {
    ShowLoading,
    HideLoading,
    ShowBanner,
    SetSyncStatus,
    Reload,
    UpdateTitle,
    SelectProject,
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

    // ======================= DATA ============================

    private _selectedProjectId: string = lsUtils.getSelectedProjectId() || ''

    get selectedProjectId() {
        return this._selectedProjectId
    }

    setSelectedProjectId(value: string): void {
        if (this._selectedProjectId === value) return
        this._selectedProjectId = value
        lsUtils.setSelectedProjectId(value)
        this.notify(Events.SelectProject, value)
    }

    resetSelectedProjectId(): void {
        this.setSelectedProjectId('')
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
    showLoading: () => store.notify(Events.ShowLoading),
    hideLoading: () => store.notify(Events.HideLoading),
    showBanner: (banner: IBanner) => store.notify(Events.ShowBanner, banner),
    setSyncStatus: (status: SyncStatuses) => store.notify(Events.SetSyncStatus, status),
    updateTitle: (data: { id: string, text: string }) => store.notify(Events.UpdateTitle, data),
    deleteCompleted: (listId: string) => store.notify(Events.DeleteCompleted, listId)
}
