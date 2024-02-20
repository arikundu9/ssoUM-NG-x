import { BehaviorSubject, Observable } from 'rxjs';

export class dataHostBase<T> {
    protected subject: BehaviorSubject<T> = new BehaviorSubject<T>(new Object() as T);
    constructor(protected _source: Observable<any>) {
        this.reload();
    }
    reload(): void {
        this._source.subscribe((res) => {
            this.subject.next(res);
        });
    }
    get value(): T {
        return this.subject.value;
    }
    get wire(): Observable<T> {
        return this.subject;
    }
    set value(v) {
        this.subject.next(v);
    }
}

export class dataHost<T> extends dataHostBase<T> {}
