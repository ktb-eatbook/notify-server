import { tags } from "typia"
import { Response } from "express"

export interface IListener {
    id: string
    email: string
    response: Response
}

export interface INotifySubject {
    to_user_id: string & tags.MaxLength<36>
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