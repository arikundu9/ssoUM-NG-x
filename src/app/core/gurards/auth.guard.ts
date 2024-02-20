import { NotificationService, authService } from '@S/index';
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    authorityCode!: string;
    constructor(private auth: authService, private router: Router, private notify: NotificationService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.auth.isLogedin) {
            // const userRole = authService.getRole();
            this.authorityCode = this.auth.user.Levels[0].Scope[0];
            if (this.authorityCode.length == 2 && route.data['role'] && route.data['role'].includes('dept')) {
                return true;
            }
            // Right now , it is true , because we need a detailed dcocument to implement this properly.
            return true;
        }
        // this.notify.error('Access Denied !!!');
        this.auth.logout();
        return false;
    }
}
