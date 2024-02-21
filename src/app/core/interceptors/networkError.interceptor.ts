import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { alertifyService } from '@S/index';
import { environment } from '@E/environment';
import { consoleLogService } from '@S/consoleLog.service';

@Injectable()
export class networkErrorInterceptor implements HttpInterceptor {
    constructor(private notify: alertifyService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMsg = '';
                if (error.error instanceof ErrorEvent) {
                    errorMsg = `Client Side Error: ${error.error.message}`;
                } else {
                    if (request.url.indexOf('buildId') == -1) {
                        errorMsg = ` Server Side Error Code: ${error.status},  Message: ${error.message}, Code: ${error.status}`;
                        switch (error.status) {
                            case 404:
                                this.notify.errorToast("404 Not Found.<br>" + error.message);
                                break;
                            case 400:
                                if (error.error.respCode == 1000) {
                                    this.notify.cloasableAlert(error.error.message);
                                }
                                break;
                            case 0:
                                this.notify.errorToast("000 No Response.<br>" + error.message);
                                break;
                        }
                    }
                }
                return throwError(() => errorMsg);
            })
        );
    }
}
