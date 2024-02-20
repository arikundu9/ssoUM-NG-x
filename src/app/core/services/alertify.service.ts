import { Injectable } from '@angular/core';
import * as alertifyjs from 'alertifyjs'; //Link:   https://alertifyjs.com/
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class alertifyService {
    constructor() {}

    errorToast(msg: string) {
        alertifyjs.error(msg);
    }
    notify(msg: string, type: string, wait: number, c: CallableFunction) {
        alertifyjs.notify(msg, type, wait, c);
    }
    nonCloasableAlert(msg: string) {
        alertifyjs.alert(`<b>${msg}</b>`).set('closable', false).set('basic', true);
    }
    cloasableAlert(msg: string) {
        alertifyjs.alert(`<b>${msg}</b>`).set('closable', true).set('basic', true);
    }
    alert(title: string, msg: string) {
        alertifyjs.alert(title, msg);
    }
}
