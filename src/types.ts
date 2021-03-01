import { nanoid } from 'nanoid';
import { SyncTargets } from './utils/Syncer';

export enum Priorities {
    Trivial,
    Minor,
    Normal,
    Major,
    Critical
}

export class Task {
    text: string
    isDone: boolean
    tasks: Task[]
    priority: Priorities
    isOpened?: boolean
    selectedSubTaskId?: string
    
    isNew: boolean
    parent: Task | null
    id: string

    constructor(text: string, parent: Task | null, isDone?: boolean, id?: string) {
        this.id = id || nanoid()
        this.text = text
        this.isDone = isDone || false
        this.tasks = []
        this.isNew = false
        this.parent = parent
        this.priority = Priorities.Trivial
    }

    get isProject() {        
        return !!!this.parent?.parent
    }
}

export class Metadata {
    updatedAt: number | undefined

    constructor(updatedAt?: number) {
        this.updatedAt = updatedAt
    }
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
    downloadTaskList: () => Promise<string | null>
    uploadData: (metadata: Metadata, taskList: string) => any
}
