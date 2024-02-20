import { Injectable } from '@angular/core';
import { localStorageService } from './localStorage.service';
import { environment } from '../../../environments/environment';
// import { consoleLogService } from './consoleLog.service';
@Injectable({
    providedIn: 'root',
})
export class authService {
    loadJwt(token: string): boolean {
        const parsedToken = this.parseJwt(token);
        if (parsedToken.application[0] == '{') {
            localStorageService.set('jt', token);
            localStorageService.set('jt_pl', parsedToken.application);
            this.isLogedin = true;
            return true;
        } else {
            return false;
        }
    }

    get user() {
        if (this.isLogedin) {
            return JSON.parse(localStorageService.get('jt_pl'));
        } else {
            this.logout();
        }
    }

    get jwt() {
        return localStorageService.get('jt');
    }

    get parsedJwt() {
        return this.parseJwt(this.jwt);
    }

    get isLogedin(): boolean {
        return localStorageService.get('iL') == 'han' && localStorageService.get('jt') != null && localStorageService.get('jt_pl') != null;
    }

    set isLogedin(v: boolean) {
        localStorageService.set('iL', v ? 'han' : 'na');
    }

    logout() {
        localStorageService.del('jt_pl');
        localStorageService.del('jt');
        localStorageService.del('iL');
        // window.open(environment.authUrl, '_self');
    }

    parseJwt(token: string) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(
            window
                .atob(base64)
                .split('')
                .map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
        );

        return JSON.parse(jsonPayload);
    }
}
