import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { throwError, Observable, Subject } from 'rxjs';
import { environment } from '@E/environment';
import { catchError, map, filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class consoleLogService {
    constructor() {}
    log(...args: any) {
        if (!environment.production) {
            console.warn.apply(console, args);
        }
    }
    static log(...args: any) {
        if (!environment.production) {
            console.warn.apply(console, args);
        }
    }
}
