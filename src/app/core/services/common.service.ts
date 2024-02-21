import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, Observable, Subject, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError, filter } from 'rxjs/operators';
import { authService } from './auth.service';
import { NotificationService } from './notification.service';
import { ToastrService } from 'ngx-toastr';
import { baseNetworkService } from './base.network.service';

@Injectable({
    providedIn: 'root',
})
export class CommonService extends baseNetworkService {

    constructor(private http: HttpClient, private auth: authService, private notify: NotificationService, private toastr: ToastrService) {
        super();
    }
    override get version(): string {
        return 'v1';
    }

    post(payload: any, url: string): Observable<any> {
        return this.http.post<any>(this.backend + url, payload).pipe(
            map(this.handleResponseCode)
        );
    }

    get(url: string) {
        return this.http.get<any>(this.backend + url).pipe(
            map(this.handleResponseCode)
        );
    }

    handleResponseCode(resp: any) {
        if (resp.respCode >= 2000 && resp.respCode < 3000) {
            // Request Success
            switch (resp.respCode) {
                case 2000:
                    if (resp.message != null)
                        alert(resp.message ?? 'Success');
                    break;
                default:
                    break;
            }
        }
        else {
            // error
            switch (resp.respCode) {
                case 1000:
                    this.notify.error(resp.message ?? 'Backend Error');
                    break;
                default:
                    break;
            }
        }
    }
}
