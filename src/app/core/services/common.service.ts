import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, Observable, Subject, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError, filter } from 'rxjs/operators';
import { authService } from './auth.service';
import { NotificationService } from './notification.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root',
})
export class CommonService {

    constructor(private http: HttpClient, private auth: authService, private notify: NotificationService, private toastr: ToastrService) {
    }

    // post(payload: any, url: string): Observable<any> {
    //     return this.http.post<any>(this.backend + url, payload);
    // }

    // getData(url: string) {
    //     return this.http.get<any>(this.backend + url);
    // }
}
