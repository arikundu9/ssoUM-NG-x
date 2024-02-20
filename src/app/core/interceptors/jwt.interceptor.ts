import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { localStorageService } from '@S/localStorage.service';
import { authService } from '@S/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private auth: authService) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (request.url.includes('Login')) {
            return next.handle(request); // Skip adding Authorization header for login requests
        }

        const authReq = request.clone({
            headers: request.headers.set('Authorization', `Bearer ${this.auth.jwt}`),
        });

        return next.handle(authReq);
    }
}
