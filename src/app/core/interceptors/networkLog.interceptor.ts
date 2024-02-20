import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, tap, throwError } from 'rxjs';
import { NotificationService } from '@S/index';
import { environment } from '@E/environment';
import { consoleLogService } from '@S/consoleLog.service';

@Injectable()
export class netlogInterceptor implements HttpInterceptor {
    constructor(private notify: NotificationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            tap((e) => {
                if (!environment.production) {
                    if (e.type != 0) {
                        consoleLogService.log('==>>',e);
                    }
                }
            })
        );
    }
}
