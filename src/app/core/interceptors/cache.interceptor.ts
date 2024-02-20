import { consoleLogService } from '@S/consoleLog.service';
import { localStorageService } from '@S/index';
import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, share, tap } from 'rxjs';
import { environment } from '@E/environment';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
    private cache: Map<HttpRequest<any>, HttpResponse<any>> = new Map();

    constructor() {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (environment.enableCache) {
            if (req.method !== 'GET' && (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH' || req.method === 'DELETE')) {
                localStorageService.del(req.urlWithParams);
                return next.handle(req);
            }
            var cachedResponse: HttpResponse<any> = JSON.parse(localStorageService.get(req.urlWithParams));
            if (cachedResponse) {
                consoleLogService.log(`${req.urlWithParams} cache found. Cached Response:`, cachedResponse);
                return of(new HttpResponse({ status: 200, body: cachedResponse.body }));
            } else {
                return next.handle(req).pipe(
                    tap((stateEvent: any) => {
                        if (stateEvent instanceof HttpResponse) {
                            localStorageService.set(req.urlWithParams, JSON.stringify(stateEvent.clone()));
                            // this.cache.set(req, stateEvent.clone());
                        }
                    })
                );
            }
        } else {
            return next.handle(req);
        }
    }
}
