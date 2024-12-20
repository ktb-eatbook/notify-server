import { Injectable } from "@nestjs/common";
import { Response } from "express";
import { 
    map, 
    Observable, 
    Subject,
    filter,
} from "rxjs";

import { IListener, INotifySubject, IToUserNotifySubject } from "../interface";

@Injectable()
export class SSESerivce {
    private sub = new Subject<INotifySubject>
    private obs = this.sub.asObservable()
    private listeners: IListener[] = []

    listen(
        id: string,
        listener_email: string,
        response: Response,
    ): Observable<MessageEvent<INotifySubject>> {
        const listener: IListener | undefined = this.listeners.find(listener => listener.id === id)
        // 이미 연결 중이라면 삭제
        if(listener !== undefined) {
            this.listeners = this.listeners.filter(user => user.id === listener.id)
        }
        this.addListener(id, listener_email, response)
        
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
        response: Response, 
    ) {
        this.listeners.push({
            id,
            email: listener_email,
            response,
        } satisfies IListener)
    }

    broadcast(subject: INotifySubject) {
        this.sub.next(subject)
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