import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/*---Component import section : start---*/
import { LoginComponent } from '@C/login/login.component';
import { DashboardComponent } from '@L/dashboard/dashboard.component';
import { HomeComponent } from '@C/home/home.component';
import { SideBarComponent } from '@C/side-bar/side-bar.component';
import { BaseComponent } from '@C/common/BasePage.component';
import { AuthGuard } from '$/gurards/auth.guard';
import { CommonDialogComponent } from '@C/common/common-dialog/common-dialog.component';
import { AppsComponent } from '@C/apps/apps.component';
import { KeysComponent } from '@C/keys/keys.component';
import { JwtsComponent } from '@C/jwts/jwts.component';

/*---Component import section : end---*/

const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'login/:token', component: LoginComponent },
    {
        path: '',
        component: DashboardComponent,
        // runGuardsAndResolvers: 'always',
        // canActivate: [AuthGuard],
        // canActivateChild: [AuthGuard],
        children: [
            { path: 'home', data: {}, component: HomeComponent },
            { path: 'apps', data: {}, component: AppsComponent },
            { path: 'keys', data: {}, component: KeysComponent },
            { path: 'jwts', data: {}, component: JwtsComponent },
            // { path: 'home', canActivate: [AuthGuard], data: {}, component: HomeComponent },
        ],
    },
];
@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule { }

//------Components declare------
export const appDeclaration = [
    LoginComponent,
    DashboardComponent,
    HomeComponent,
    SideBarComponent,
    BaseComponent,
    CommonDialogComponent,
    AppsComponent,
    KeysComponent,
    JwtsComponent
];
