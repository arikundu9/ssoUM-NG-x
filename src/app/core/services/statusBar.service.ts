import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { throwError, Observable, Subject } from 'rxjs';
import { environment } from '@E/environment';
import { catchError, map, filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class statusBarService {
    colorMode: 'info' | 'warn' | 'danger' = 'info';
    static _text: string = '';
    constructor() {
        statusBarService._text = '';
    }
    set text(v: string) {
        statusBarService._text = v;
    }
    get text(): string {
        return statusBarService._text;
    }
}
