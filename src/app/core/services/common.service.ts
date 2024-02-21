import { Injectable, Injector } from '@angular/core';
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

    constructor(injector: Injector) {
        super(injector);
    }
    override get version(): string {
        return 'v1';
    }

    post(payload: any, url: string): Observable<any> {
        return this.http.post<any>(this.backend + url, payload).pipe(
            map(this.handleResponseCode)
        ).pipe(
            catchError(this.handleError)
        );
    }

    get(url: string) {
        return this.http.get<any>(this.backend + url).pipe(
            map(this.handleResponseCode)
        ).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Handles response code
     * @param resp
     */
    private handleResponseCode = (resp: any) => {
        if (resp.respCode >= 2000 && resp.respCode < 3000) {
            // Request Success
            switch (resp.respCode) {
                case 2000:
                    if (resp.message != null) {
                        this.notifyIt.success(resp.message ?? 'Success');
                        this.statusBar.text = resp.message ?? 'Success';
                    }
                    break;
                default:
                    break;
            }
        }
        else {
            // error
            switch (resp.respCode) {
                case 1000:
                    this.notifyIt.error(resp.message ?? 'Backend Error');
                    break;
                default:
                    break;
            }
        }
        return resp;
    }

    /**
     * catches backend errors
     * @param error
     * @returns
     */
    private handleError = (error: HttpErrorResponse) => {
        if (error.status === 0) {
            // A client-side or network error occurred. Handle it accordingly.
            this.notifyIt.error('An error occurred:');
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            switch (error.error.respCode) {
                case 1000:
                    this.notifyIt.error(error.error.message ?? 'Backend Error');
                    break;
                default:
                    break;
            }
            this.notifyIt.error(`Backend error ${error.status}`);
        }
        // Return an observable with a user-facing error message.
        return throwError(() => new Error('Something bad happened; please try again later.'));
    }
}
