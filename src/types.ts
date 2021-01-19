import { SyncStatuses } from './components/Statuses/SyncStatus';
import { SyncTargets } from './utils/Syncer';
export interface IStore {
    taskList: Task
    addedItemPath?: string
    modal?: IModal
    banner?: IBanner
    showSidebar?: boolean
    loading?: boolean
    syncStatus?: SyncStatuses
    updatedAt?: number
}

export class Task {
    path: string
    text: string
    isDone: boolean
    tasks: Task[]
    selectedSubTaskPath?: string

    constructor(path: string, text: string, isDone: boolean = false) {
        this.path = path
        this.text = text
        this.isDone = isDone
        this.tasks = []
    }
}

export class Metadata {
    updatedAt: number | undefined

    constructor(updatedAt?: number) {
        this.updatedAt = updatedAt
    }
}

export interface IModal {
    text: string
    okAction?: () => void 
    cancelAction?: () => void
}

export interface IBanner {
    text: string
    type: BannerTypes
    delay?: number
}

export enum BannerTypes {
    Success = "success",
    Warning = "warning",
    Failure = "failure"
}

export class FailureBanner implements IBanner {
    text: string
    type: BannerTypes

    constructor(text: string) {
        this.text = text
        this.type = BannerTypes.Failure
    }
}

export class SuccessBanner implements IBanner {
    text: string
    type: BannerTypes
    delay: number

    constructor(text: string, delay: number = 5) {
        this.text = text
        this.type = BannerTypes.Success
        this.delay = delay
    }
}

export interface ICloudConnector {
    syncTarget: SyncTargets
    authorize: () => any
    check: () => any
    downloadMetadata: () => Promise<Metadata>
    downloadTaskList: () => Promise<Task | null>
    uploadData: (metadata: Metadata, taskList: Task) => any
}

export interface IActions {
    setAppData: (state: IStore) => IStore,
    createTaskAction: (item: Task) => IStore,
    updateTaskAction: (item: Task) => IStore,
    deleteTaskAction: (item: Task) => IStore,
    selectTaskAction: (parentItem: Task) => IStore,
    setModal: (modal: IModal | null) => IStore,
    setBanner: (banner: IBanner | null) => IStore,
    setShowSidebar: (value: boolean) => IStore,
    setLoading: (value: boolean) => IStore,
    setSyncStatus: (status: SyncStatuses) => IStore,
    saveToLocalStorage: () => IStore,
    moveTaskAction: (movedItemPath: string, siblingPath: string | null) => IStore
}

export interface IContext {
    store: IStore,
    actions: IActions
}