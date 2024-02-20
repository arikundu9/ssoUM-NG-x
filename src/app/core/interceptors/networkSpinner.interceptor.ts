import { consoleLogService } from '@S/consoleLog.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, finalize, map, tap } from 'rxjs';

@Injectable()
export class netSpinnerInterceptor implements HttpInterceptor {
    constructor(private spinner: NgxSpinnerService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // consoleLogService.log('[+] showing',request.urlWithParams);
        this.spinner.show();
        return next.handle(request).pipe(
            finalize(() => {
                // consoleLogService.log('[-] hiding',request.urlWithParams);
                this.spinner.hide();
            })
        );
    }
}
