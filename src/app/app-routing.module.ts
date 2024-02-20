import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/*---Component import section : start---*/
import { LoginComponent } from '@L/login/login.component';
import { DashboardComponent } from '@L/dashboard/dashboard.component';
import { HomeComponent } from '@L/home/home.component';
import { SideBarComponent } from '@L/side-bar/side-bar.component';
import { WbBudgetDistEntryMultiHoaToSingleRcvrChildComponent } from '@C/BudgetDistribution/wb-budget-dist-entry-multi-hoa-to-single-rcvr-child/wb-budget-dist-entry-multi-hoa-to-single-rcvr-child.component';
import { WbBudgetDistEntrySingleHoaToMultiRcvrChildComponent } from '@C/BudgetDistribution/wb-budget-dist-entry-single-hoa-to-multi-rcvr-child/wb-budget-dist-entry-single-hoa-to-multi-rcvr-child.component';
import { WbBudgetDistEntryParentComponent } from '@C/BudgetDistribution/wb-budget-dist-entry-parent/wb-budget-dist-entry-parent.component';
import { HoaDetailsComponent } from '@C/common/hoa-details/hoa-details.component';
import { WbBudgetDistModifyComponent } from '@C/BudgetDistribution/wb-budget-dist-modify/wb-budget-dist-modify.component';
import { WbBudgetDistApproveComponent } from '@C/BudgetDistribution/wb-budget-dist-approve/wb-budget-dist-approve.component';
import { WbBudgetDistDeleteAfterApprovalComponent } from '@C/BudgetDistribution/wb-budget-dist-delete-after-approval/wb-budget-dist-delete-after-approval.component';
import { WbBudgetDistSanctionLetterManagementComponent } from '@C/sanction/wb-budget-dist-sanction-letter-management/wb-budget-dist-sanction-letter-management.component';
import { WbBudgetDistDraftManagementComponent } from '@C/sanction/wb-budget-dist-draft-management/wb-budget-dist-draft-management.component';
import { RevokeEntryComponent } from '@C/revoke/revoke-entry/revoke-entry.component';
import { BudgetReAppropriationEntryComponent } from '@C/BudgetReAppropriation/budget-re-appropriation-entry/budget-re-appropriation-entry.component';
import { BudgetSurrenderEntryComponent } from '@C/BudgetSurrender/budget-surrender-entry/budget-surrender-entry.component';
import { BaseComponent } from '@C/common/BasePage.component';
import { BudgetReApproprationModifyComponent } from '@C/BudgetReAppropriation/budget-re-appropration-modify/budget-re-appropration-modify.component';
import { BudgetReApproprationApproveComponent } from '@C/BudgetReAppropriation/budget-re-appropration-approve/budget-re-appropration-approve.component';
import { AuthGuard } from '$/gurards/auth.guard';
import { WbBudgetRedistEntryComponent } from '@C/BudgetRedistribution/wb-budget-redist-entry/wb-budget-redist-entry.component';
import { WbBudgetRequisitionEntryComponent } from '@C/BudgetRequisition/wb-budget-requisition-entry/wb-budget-requisition-entry.component';
import { WbBudgetRequisitionActionComponent } from '@C/BudgetRequisition/wb-budget-requisition-action/wb-budget-requisition-action.component';
import { RequisitionTaskListComponent } from '@C/BudgetRequisition/requisition-task-list/requisition-task-list.component';
import { CommonDialogComponent } from '@C/common/common-dialog/common-dialog.component';
import { CreateAutoAllotmentComponent } from '@C/BudgetAutoDistribution/create-auto-allotment/create-auto-allotment.component';
import { ActionOnAutoAllotmentComponent } from '@C/BudgetAutoDistribution/action-on-auto-allotment/action-on-auto-allotment.component';

/*---Component import section : end---*/

const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'login/:token', component: LoginComponent },
    {
        path: '',
        component: DashboardComponent,
        // runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        // canActivateChild: [AuthGuard],
        children: [
            { path: 'home', canActivate: [AuthGuard], data: {}, component: HomeComponent },
            { path: 'wbBudgetEntry', canActivate: [AuthGuard], data: {}, component: WbBudgetDistEntryParentComponent },
            { path: 'wbBudgetModify', canActivate: [AuthGuard], data: {}, component: WbBudgetDistModifyComponent },
            { path: 'wbBudgetApprove', canActivate: [AuthGuard], data: {}, component: WbBudgetDistApproveComponent },
            { path: 'wbBudgetDelAfterApproval', canActivate: [AuthGuard], data: {}, component: WbBudgetDistDeleteAfterApprovalComponent },
            { path: 'wbBudgetSanctionLetterMngmt', canActivate: [AuthGuard], data: {}, component: WbBudgetDistSanctionLetterManagementComponent },
            { path: 'wbBudgetDraftMngmt', canActivate: [AuthGuard], data: {}, component: WbBudgetDistDraftManagementComponent },
            { path: 'wbBudgetWithdrawal', canActivate: [AuthGuard], data: {}, component: RevokeEntryComponent },
            { path: 'wbBudgetReAppropriation', canActivate: [AuthGuard], data: {}, component: BudgetReAppropriationEntryComponent },
            { path: 'wbBudgetSurrenderEntry', canActivate: [AuthGuard], data: {}, component: BudgetSurrenderEntryComponent },
            { path: 'wbBudgetReAppropriationEntry', canActivate: [AuthGuard], data: {}, component: BudgetReAppropriationEntryComponent },
            { path: 'wbBudgetReAppropriationModify', canActivate: [AuthGuard], data: {}, component: BudgetReApproprationModifyComponent },
            { path: 'wbBudgetReAppropriationApprove', canActivate: [AuthGuard], data: {}, component: BudgetReApproprationApproveComponent },
            { path: 'WbBudgetRedistEntry', canActivate: [AuthGuard], data: { role: ['dept'] }, component: WbBudgetRedistEntryComponent },
            { path: 'WbBudgetRequisitionEntry', canActivate: [AuthGuard], data: {}, component: WbBudgetRequisitionEntryComponent },
            { path: 'WbBudgetRequisitionAction', canActivate: [AuthGuard], data: {}, component: WbBudgetRequisitionActionComponent },
            { path: 'WbBudgetRequisitionList', canActivate: [AuthGuard], data: {}, component: RequisitionTaskListComponent },
            { path: 'wbBudgetCreateAutoAllotment', canActivate: [AuthGuard], data: {}, component: CreateAutoAllotmentComponent },
            { path: 'wbBudgetAutoAllotmentAction', canActivate: [AuthGuard], data: {}, component: ActionOnAutoAllotmentComponent },
        ],
    },
];
@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}

//------Components declare------
export const appDeclaration = [LoginComponent, DashboardComponent, HomeComponent, SideBarComponent, WbBudgetDistEntryParentComponent, WbBudgetDistEntrySingleHoaToMultiRcvrChildComponent, WbBudgetDistEntryMultiHoaToSingleRcvrChildComponent, HoaDetailsComponent, WbBudgetDistModifyComponent, WbBudgetDistApproveComponent, WbBudgetDistDeleteAfterApprovalComponent, WbBudgetDistSanctionLetterManagementComponent, WbBudgetDistDraftManagementComponent, RevokeEntryComponent, BudgetReAppropriationEntryComponent, BudgetSurrenderEntryComponent, BaseComponent, BudgetReApproprationModifyComponent, BudgetReApproprationApproveComponent, WbBudgetRedistEntryComponent, WbBudgetRequisitionEntryComponent, WbBudgetRequisitionActionComponent, RequisitionTaskListComponent, CommonDialogComponent, CreateAutoAllotmentComponent, ActionOnAutoAllotmentComponent];
