import { authService } from '@S/auth.service';
import { CommonService } from '@S/common.service';
import { NotificationService } from '@S/notification.service';
import { ValidationService } from '@S/validation.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-wb-budget-requisition-entry',
    templateUrl: './wb-budget-requisition-entry.component.html',
    styleUrls: ['./wb-budget-requisition-entry.component.scss'],
})
export class WbBudgetRequisitionEntryComponent implements OnInit {
    accordionStep = 0;
    requisitionForm!: FormGroup;
    requisitionPayload: any[] = [];
    hoaData: any;
    userLevel: number;
    uppereLevelUser: any;
    copyUppereLevelUser: any;

    departmentlist: any[] = [];
    copyDepartmentlist: any[] = [];

    constructor(private commonService: CommonService, private notify: NotificationService, private fb: FormBuilder, private validatorService: ValidationService, private auth: authService) {
        this.userLevel = this.auth.user.Levels[0].Scope[0].length > 4 ? +this.auth.user.Levels[0].Scope[0].substring(2, 4) : 1;
    }

    ngOnInit(): void {
        this.requisitionForm = this.fb.group({
            uppperLevelUser: [, [Validators.required]],
            amount: [, [Validators.required]],
            requestRemarks: [, [Validators.required]],
            filterUpperLevelUserByDept: [this.auth.user.Levels[0].Scope[0].substring(0, 2), [Validators.required]],
        });
        this.onDeptSelect(null, { code: this.auth.user.Levels[0].Scope[0].substring(0, 2) });
        this.commonService.getDemandData().subscribe((resp) => {
            this.departmentlist = this.copyDepartmentlist = resp;
        });
        if (this.userLevel <= 2) {
            this.requisitionForm.controls.filterUpperLevelUserByDept.clearValidators();
            this.requisitionForm.controls.filterUpperLevelUserByDept.updateValueAndValidity();
            this.requisitionForm.controls.uppperLevelUser.clearValidators();
            this.requisitionForm.controls.uppperLevelUser.updateValueAndValidity();
        }
    }

    setAccordionStep(index: number) {
        this.accordionStep = index;
    }

    get grandTotal() {
        let sum: number = 0;
        this.requisitionPayload.forEach((elm: any) => {
            if (elm != undefined) {
                sum = sum + elm.amount;
            }
        });
        return sum;
    }

    filterHOA(e: any) {
        this.hoaData = e;
    }

    searchUpperLevelUser(e: any) {
        if (e !== undefined) {
            let term = '';
            if (e.target.value.length > 0) {
                term = e.target.value;
            }
            if (term !== undefined && term !== '' && term != null) {
                if (term.length > 0) {
                    this.uppereLevelUser = this.copyUppereLevelUser?.filter((data: any) => {
                        return data.name?.toLowerCase().indexOf(term.toLowerCase()) >= 0 || data.code.toLowerCase().indexOf(term.toLowerCase()) >= 0;
                    });
                }
            } else {
                this.uppereLevelUser = this.copyUppereLevelUser;
            }
        }
    }

    searchDepartment(e: any) {
        if (e !== undefined) {
            let term = '';
            if (e.target.value.length > 0) {
                term = e.target.value;
            }
            if (term !== undefined && term !== '' && term != null) {
                if (term.length > 0) {
                    this.departmentlist = this.copyDepartmentlist?.filter((data: any) => {
                        return data.name?.toLowerCase().indexOf(term.toLowerCase()) >= 0 || data.code.toLowerCase().indexOf(term.toLowerCase()) >= 0;
                    });
                }
            } else {
                this.departmentlist = this.copyDepartmentlist;
            }
        }
    }

    onDeptSelect(e: any, dept: any) {
        this.commonService.getUpperLevelUser(this.userLevel, this.userLevel == 2 ? 1 : this.userLevel, dept.code).subscribe((resp) => {
            this.uppereLevelUser = this.copyUppereLevelUser = resp;
        });
    }

    addToPayload() {
        if (this.hoaData && this.requisitionForm.valid) {
            this.requisitionPayload.push({
                deptCode: 'ZZ',
                demandNo: this.hoaData.demand,
                majorHead: this.hoaData.major_head,
                submajorHead: this.hoaData.sub_major_head,
                minorHead: this.hoaData.minor_head,
                planStatus: '00',
                schemeHead: this.hoaData.sub_head,
                detailHead: this.hoaData.detailed_head,
                subdetailHead: this.hoaData.subDetailHead,
                votedCharged: this.hoaData.votedCharged,
                requestToSaoDdoCode: this.userLevel === 2 ? this.auth.user.Levels[0].Scope[0].substring(0, 2) : this.requisitionForm.value.uppperLevelUser.trim(),
                amount: this.requisitionForm.value.amount,
                requestRemark: this.requisitionForm.value.requestRemarks,
            });
            this.requisitionForm.controls.uppperLevelUser.reset();
            this.requisitionForm.controls.amount.reset();
            this.requisitionForm.controls.requestRemarks.reset();
        } else {
            this.notify.alert('Please fill all the required fields..!');
            this.requisitionForm.markAllAsTouched();
        }
    }

    deleteRowFromPayload(i: number) {
        this.requisitionPayload.splice(i, 1);
    }

    submitRequisition() {
        if (this.requisitionPayload) {
            this.commonService.sendRequisition(this.requisitionPayload).subscribe((resp) => {});
        }
    }
}
