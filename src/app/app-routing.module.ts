import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/*---Component import section : start---*/
import { LoginComponent } from '@L/login/login.component';
import { DashboardComponent } from '@L/dashboard/dashboard.component';
import { HomeComponent } from '@L/home/home.component';
import { SideBarComponent } from '@L/side-bar/side-bar.component';
import { BaseComponent } from '@C/common/BasePage.component';
import { AuthGuard } from '$/gurards/auth.guard';
import { CommonDialogComponent } from '@C/common/common-dialog/common-dialog.component';

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
export const appDeclaration = [LoginComponent, DashboardComponent, HomeComponent, SideBarComponent, BaseComponent, CommonDialogComponent];
