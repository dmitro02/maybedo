import { nanoid } from 'nanoid';
import { SyncStatuses } from './components/Statuses/SyncStatus';
import { SyncTargets } from './utils/Syncer';

export interface IStore {
    modal?: IModal
    banner?: IBanner
    showSidebar?: boolean
    loading?: boolean
    syncStatus?: SyncStatuses
}

export class Task {
    id: string
    text: string
    isDone: boolean
    tasks: Task[]
    selectedSubTaskId?: string
    isNew: boolean
    parent: Task | null
    updatedAt?: number

    constructor(text: string, parent: Task | null, isDone: boolean = false, ) {
        this.id = nanoid()
        this.text = text
        this.isDone = isDone
        this.tasks = []
        this.isNew = false
        this.parent = parent
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
    Success = "SUCCESS",
    Warning = "WARNING",
    Failure = "FAILURE"
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
    downloadTaskList: () => Promise<string | null>
    uploadData: (metadata: Metadata, taskList: string) => any
}

export interface IActions {
    setModal: (modal: IModal | null) => IStore,
    setBanner: (banner: IBanner | null) => IStore,
    setShowSidebar: (value: boolean) => IStore,
    setLoading: (value: boolean) => IStore,
    setSyncStatus: (status: SyncStatuses) => IStore,
    triggerCascadingUpdate: () => IStore
}

export interface IContext {
    store: IStore,
    actions: IActions
}