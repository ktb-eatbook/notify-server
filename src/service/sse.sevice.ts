import { Injectable } from "@nestjs/common";
import { 
    map, 
    Observable, 
    Subject,
    filter,
} from "rxjs";

import { 
    IListener, 
    INotifySubject, 
    INovelNotifySubject, 
    IToUserNotifySubject 
} from "../interface";

@Injectable()
export class SSESerivce {
    private sub = new Subject<INotifySubject>
    private obs = this.sub.asObservable()
    private listeners: IListener[] = []

    listen(
        id: string,
        listener_email: string,
    ): Observable<MessageEvent<INotifySubject>> {
        const listener: IListener | undefined = this.listeners.find(listener => listener.id === id)
        // 이미 연결 중이라면 삭제
        if(listener !== undefined) {
            this.listeners = this.listeners.filter(user => user.id === listener.id)
        }
        this.addListener(id, listener_email)

        return this.obs.pipe(
            filter(subject => this.filterFactory(subject, listener_email)),
            // MessageEvent는 고정된 형식
            map(data => ({ data } as MessageEvent<INotifySubject>))
        )
    }

    disconnectListener(listener_id: string) {
        this.listeners = this.listeners.filter(user => user.id === listener_id)
    }

    addListener(
        id: string,
        listener_email: string,
    ) {
        this.listeners.push({
            id,
            email: listener_email,
        } satisfies IListener)
    }

    broadcast(subject: Omit<INotifySubject, "type">) {
        this.sub.next({
            ...subject,
            type: "all",
        })
    }

    toUser(subject: Omit<IToUserNotifySubject, "type">) {
        this.sub.next({
            ...subject,
            type: "to_user",
        })
    }

    novel(subject: Omit<INovelNotifySubject, "type">) {
        this.sub.next({
            ...subject,
            type: "novel",
        })
    }

    filterFactory(
        subject: INotifySubject,
        to_email: string,
    ): boolean {
        switch(subject.type)  {
            case "all":
            case "event":
            case "novel":
                return true
            case "to_user":
                const toUserSubject: IToUserNotifySubject = subject as IToUserNotifySubject
                return toUserSubject.to_email === to_email
        }
    }
}