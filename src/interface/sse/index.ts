import { tags } from "typia"

export interface IListener {
    id: string
    email: string
}

export interface INotifySubject {
    title: string
    message: string
    type: NotifyType
}

export interface IToUserNotifySubject extends INotifySubject {
    to_email: string & tags.Format<"email"> & tags.MaxLength<255>
}

export interface INovelNotifySubject extends INotifySubject {
    novel_id: string & tags.MaxLength<36>
    novel_title: string
    summary: string
}

export type NotifyType = "all" | "to_user" | "event" | "novel"