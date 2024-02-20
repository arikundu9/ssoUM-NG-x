import { EnumSanctionType } from '@C/common/enum';
import { authService } from '@S/auth.service';
import { CommonService } from '@S/common.service';
import { NotificationService } from '@S/notification.service';
import { ValidationService } from '@S/validation.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FromArrayHelper } from 'app/helper/utils';

@Component({
    selector: 'app-wb-budget-requisition-action',
    templateUrl: './wb-budget-requisition-action.component.html',
    styleUrls: ['./wb-budget-requisition-action.component.scss'],
})
export class WbBudgetRequisitionActionComponent implements OnInit {
    accordionStep = 0;
    allotSource: any;
    clickedRows = new Set<any>();
    isRowClicked: boolean = false;
    displayedColumns: string[] = ['id', 'initialRequestBySaoDdoCode', 'requestBySaoDdoCode', 'hoa', 'amount', 'requestremark', 'requisitiondate', 'selection'];
    copyAllotSource: any;
    requisitionFormArrayHelper!: FromArrayHelper;
    requisitionForm!: FormGroup;
    requisitionPayload: any[] = [];
    isForwardRequisitionClicked: boolean = false;
    isRejectRequisitionClicked: boolean = false;
    isApproveRequisitionClicked: boolean = false;
    upperLevelUser: any[] = [];
    copyUppereLevelUser: any[] = [];
    userLevel: number;
    memoForm!: FormGroup;
    finalPayload: any;
    datePipeString: any;
    today = new Date();
    copyForwardFAH!: FromArrayHelper;
    isNextClicked: boolean = false;
    approveRequisitionPayloadArray: any[] = [];

    private paginator!: MatPaginator;
    private sort!: MatSort;
    hoaDetails: any;

    departmentlist: any[] = [];
    copyDepartmentlist: any[] = [];
    isApprovedAmountVerified: boolean = true;

    @ViewChild(MatSort) set matSort(ms: MatSort) {
        this.sort = ms;
    }
    @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
        this.paginator = mp;
    }

    constructor(private commonService: CommonService, private notify: NotificationService, private fb: FormBuilder, private validatorService: ValidationService, private auth: authService, private datePipe: DatePipe, private router: Router) {
        this.userLevel = +this.auth.user.Levels[0].Scope[0].substring(2, 4);
    }

    ngOnInit(): void {
        this.getRequisition();
        this.requisitionForm = this.fb.group({
            requisitionFormArray: this.fb.array([]),
        });
        this.requisitionFormArrayHelper = new FromArrayHelper(this.requisitionForm.controls.requisitionFormArray, {
            uppperLevelUser: [, [Validators.required]],
            frowardRem: [, [Validators.required]],
            rejectionRem: [, [Validators.required]],
            amountToBeApproved: [, [Validators.required]],
            approveRem: [, [Validators.required]],
            filterUpperLevelUserByDept: [this.auth.user.Levels[0].Scope[0].substring(0, 2), [Validators.required]],
        });
        this.memoForm = this.fb.group({
            memoNo: this.validatorService.validation('', 0, 100, ''),
            date: ['', Validators.required],
            remarks: this.validatorService.validation('Not Required', 0, 500, ''),
            copyForward: this.fb.array([]),
        });
        this.copyForwardFAH = new FromArrayHelper(this.memoForm.controls.copyForward, {
            forwardTo: [],
        });
    }

    get clickedRowsArray(): any[] {
        return Array.from(this.clickedRows);
    }

    getRequisition() {
        this.commonService.getRequisitionData().subscribe((resp) => {
            this.allotSource = this.copyAllotSource = new MatTableDataSource(resp);
            this.allotSource.paginator = this.paginator;
            this.allotSource.sort = this.sort;
        });
    }

    addRequisitionFormController() {
        this.requisitionFormArrayHelper.clear();
        for (let i = 0; i < this.clickedRowsArray.length; i++) {
            this.requisitionFormArrayHelper.addControl();
        }
    }

    setAccordionStep(index: number) {
        this.accordionStep = index;
    }

    nextAccordionStep() {
        this.accordionStep++;
    }

    prevAccordionStep() {
        this.accordionStep--;
    }

    masterToggle() {
        this.isAllSelected() ? this.clickedRows.clear() : this.allotSource.filteredData.forEach((row: any) => this.clickedRows.add(row));
        if (this.clickedRows.size) this.isRowClicked = true;
        else this.isRowClicked = false;
    }

    isAllSelected() {
        const numSelected = this.clickedRows.size;
        const numRows = this.allotSource.filteredData.length;
        return numSelected === numRows;
    }

    tickRow(_event: any, row: any) {
        const rowSelected = this.clickedRows.size;
        this.clickedRows.has(row) ? this.clickedRows.delete(row) : this.clickedRows.add(row);
        if (this.clickedRows.size) this.isRowClicked = true;
        else this.isRowClicked = false;
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

    searchUpperLevelUser(e: any) {
        if (e !== undefined) {
            let term = '';
            if (e.target.value.length > 0) {
                term = e.target.value;
            }
            if (term !== undefined && term !== '' && term != null) {
                if (term.length > 0) {
                    this.upperLevelUser = this.copyUppereLevelUser?.filter((data: any) => {
                        return data.name?.toLowerCase().indexOf(term.toLowerCase()) >= 0 || data.code.toLowerCase().indexOf(term.toLowerCase()) >= 0;
                    });
                }
            } else {
                this.upperLevelUser = this.copyUppereLevelUser;
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
            this.upperLevelUser = this.copyUppereLevelUser = resp;
        });
    }

    goForForwardRequisition() {
        if (this.clickedRowsArray.length > 0) {
            this.isForwardRequisitionClicked = true;
            this.isRejectRequisitionClicked = false;
            this.isApproveRequisitionClicked = false;
            this.addRequisitionFormController();
            this.nextAccordionStep();
            this.requisitionFormArrayHelper.controls.forEach((elm: any, i: number) => {
                elm.controls.rejectionRem.clearValidators();
                elm.controls.rejectionRem.updateValueAndValidity();
                elm.controls.amountToBeApproved.clearValidators();
                elm.controls.amountToBeApproved.updateValueAndValidity();
                elm.controls.approveRem.clearValidators();
                elm.controls.approveRem.updateValueAndValidity();
            });
            this.onDeptSelect(null, { code: this.auth.user.Levels[0].Scope[0].substring(0, 2) });
            this.commonService.getDemandData().subscribe((resp) => {
                this.departmentlist = this.copyDepartmentlist = resp;
            });
        } else {
            this.notify.alert('Please select atleast one row..!');
        }
    }

    goForRejectRequisition() {
        if (this.clickedRowsArray.length > 0) {
            this.isRejectRequisitionClicked = true;
            this.isForwardRequisitionClicked = false;
            this.isApproveRequisitionClicked = false;
            this.addRequisitionFormController();
            this.nextAccordionStep();
            this.requisitionFormArrayHelper.controls.forEach((elm: any, i: number) => {
                elm.controls.frowardRem.clearValidators();
                elm.controls.frowardRem.updateValueAndValidity();
                elm.controls.uppperLevelUser.clearValidators();
                elm.controls.uppperLevelUser.updateValueAndValidity();
                elm.controls.amountToBeApproved.clearValidators();
                elm.controls.amountToBeApproved.updateValueAndValidity();
                elm.controls.approveRem.clearValidators();
                elm.controls.approveRem.updateValueAndValidity();
            });
        } else {
            this.notify.alert('Please select atleast one row..!');
        }
    }

    goToApprove() {
        if (this.clickedRowsArray.length > 0) {
            this.isApproveRequisitionClicked = true;
            this.isForwardRequisitionClicked = false;
            this.isRejectRequisitionClicked = false;
            this.addRequisitionFormController();
            this.nextAccordionStep();
            this.requisitionFormArrayHelper.controls.forEach((elm: any, i: number) => {
                elm.controls.uppperLevelUser.clearValidators();
                elm.controls.uppperLevelUser.updateValueAndValidity();
                elm.controls.frowardRem.clearValidators();
                elm.controls.frowardRem.updateValueAndValidity();
                elm.controls.rejectionRem.clearValidators();
                elm.controls.rejectionRem.updateValueAndValidity();
                elm.controls.filterUpperLevelUserByDept.clearValidators();
                elm.controls.filterUpperLevelUserByDept.updateValueAndValidity();
            });
            this.memoForm.patchValue({
                date: this.today,
            });
        } else {
            this.notify.alert('Please select atleast one row..!');
        }
    }

    deleteFormArrayEntry(i: number) {
        this.clickedRows.delete(this.clickedRowsArray[i]);
        this.requisitionFormArrayHelper.deleteControlAt(i);
    }

    rejectRequisition() {
        if (this.userLevel <= 2) {
            this.requisitionFormArrayHelper.controls.forEach((elm: any, i: number) => {
                elm.controls.uppperLevelUser.clearValidators();
                elm.controls.filterUpperLevelUserByDept.clearValidators();
                elm.controls.uppperLevelUser.updateValueAndValidity();
                elm.controls.filterUpperLevelUserByDept.updateValueAndValidity();
            });
        }
        if (this.requisitionFormArrayHelper.valid) {
            let rejectRequisitionPayloadArray: any[] = [];
            this.requisitionFormArrayHelper.value.forEach((elm: any, i: number) => {
                const rejectReqPayload = {
                    requisitionId: this.clickedRowsArray[i].requisition.id,
                    remarks: elm.rejectionRem,
                };
                rejectRequisitionPayloadArray.push(rejectReqPayload);
            });
            this.commonService.rejectRequisition(rejectRequisitionPayloadArray).subscribe((resp) => {});
        } else {
            this.notify.alert('Please fill the form carefully..!');
            this.requisitionFormArrayHelper.controls.forEach((elm: any) => {
                elm.markAllAsTouched();
            });
        }
    }

    forwardRequisition() {
        if (this.userLevel <= 2) {
            this.requisitionFormArrayHelper.controls.forEach((elm: any, i: number) => {
                elm.controls.uppperLevelUser.clearValidators();
                elm.controls.filterUpperLevelUserByDept.clearValidators();
                elm.controls.uppperLevelUser.updateValueAndValidity();
                elm.controls.filterUpperLevelUserByDept.updateValueAndValidity();
            });
        }
        if (this.requisitionFormArrayHelper.valid) {
            let forwardRequisitionPayloadArray: any[] = [];
            this.requisitionFormArrayHelper.value.forEach((elm: any, i: number) => {
                const forwardReqPayload = {
                    requisitionId: this.clickedRowsArray[i].requisition.id,
                    sendToSaoCode: this.userLevel === 2 ? this.auth.user.Levels[0].Scope[0].substring(0, 2) : elm.uppperLevelUser.trim(),
                    remarks: elm.frowardRem,
                };
                forwardRequisitionPayloadArray.push(forwardReqPayload);
            });
            this.commonService.forwardRequisition(forwardRequisitionPayloadArray).subscribe((resp) => {});
        } else {
            this.notify.alert('Please fill the form carefully..!');
            this.requisitionFormArrayHelper.controls.forEach((elm: any) => {
                elm.markAllAsTouched();
            });
        }
    }

    memoGeneration() {
        if (this.requisitionFormArrayHelper.valid) {
            this.isApprovedAmountVerified = true;
            this.approveRequisitionPayloadArray = [];
            this.requisitionFormArrayHelper.value.forEach((elm: any, i: number) => {
                if (elm.amountToBeApproved < (this.clickedRowsArray[i].wallet !== null ? this.clickedRowsArray[i].wallet?.ceilingAmount : 0)) {
                    const approveReqPayload = {
                        requisitionId: this.clickedRowsArray[i].requisition.id,
                        amount: elm.amountToBeApproved,
                        remarks: elm.approveRem,
                    };
                    this.approveRequisitionPayloadArray.push(approveReqPayload);
                } else {
                    this.notify.alert('The amount you want to approve is not available to the corresponding HOA..!');
                    this.isApprovedAmountVerified = false;
                    this.requisitionFormArrayHelper.fromGroupAt(i).controls.amountToBeApproved.reset();
                    this.requisitionFormArrayHelper.fromGroupAt(i).controls.amountToBeApproved.markAsTouched();
                    return;
                }
            });
            if (this.isApprovedAmountVerified) {
                this.isNextClicked = true;
                this.nextAccordionStep();
            }
        } else {
            this.notify.alert('Please fill all the necessarry fields..!');
            this.requisitionFormArrayHelper.controls.forEach((elm: any) => {
                elm.markAllAsTouched();
            });
        }
    }

    approveAndSanction() {
        if (!this.memoForm.valid) {
            this.notify.alert('Please check all the fields carefully..!');
            this.memoForm.markAllAsTouched();
        } else {
            this.notify.confirmProposal('Are you sure ?', 'Do you really want to generate sanction?').then((res) => {
                if (res) {
                    let idArray: any[] = [];
                    let copyArray: any[] = [];
                    let sum: number = 0;

                    this.datePipeString = this.datePipe.transform(this.memoForm.value.date, 'yyyy-MM-dd');

                    this.copyForwardFAH.value.forEach((element: any) => {
                        copyArray.push(element.forwardTo);
                    });

                    // this.clickedRowsArray.forEach((elem) => {
                    //     idArray.push(elem.allotmentId);
                    //     sum = sum + elem.budgetAllotedAmount;
                    // });

                    this.finalPayload = {
                        // allotmentIds: idArray,
                        copyTo: copyArray,
                        remarks: this.memoForm.value.remarks,
                        memoNumber: this.memoForm.value.memoNo,
                        memoDate: this.datePipeString,
                        // majorHead: this.hoaDetails.major_head,
                        // sanctionAmount: sum,
                        // sanctionType: EnumSanctionType.Allotment,
                        // transactionType: 0, // 1 for Revoke & 0 for Release.
                        // sanctionStatus: 1, // 1 for sanction.
                        requisitions: this.approveRequisitionPayloadArray,
                    };
                    console.log(this.finalPayload);
                    this.commonService.approveAndSanctionRequisition(this.finalPayload).subscribe({
                        next: (res) => {
                            // this.decodeAndDownloadPdf(res.sanctionLetterFile);
                        },
                        error: (er) => {
                            console.log(er);
                        },
                    });
                }
            });
        }
    }

    downloadPdf(s: string) {
        const ds = atob(s);
        const byteNumbers = new Array(ds.length);
        for (let i = 0; i < ds.length; i++) {
            byteNumbers[i] = ds.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const bb = new Blob([byteArray], { type: 'application/pdf' });
        var downloadURL = window.URL.createObjectURL(bb);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'Letter.pdf';
        link.click();
    }

    decodeAndDownloadPdf(s: string) {
        const ds = atob(s);
        const byteNumbers = new Array(ds.length);
        for (let i = 0; i < ds.length; i++) {
            byteNumbers[i] = ds.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const bb = new Blob([byteArray], { type: 'application/pdf' });
        var downloadURL = window.URL.createObjectURL(bb);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'Letter.pdf';
        link.click();

        // window.open(downloadURL);
        this.router.navigate(['home']); // This statement is extra between the function decodeAndDownloadPdf(s: string) and downloadPdf(s: string) .
    }

    filterHOA(e: any) {
        // this.isSearchDone = true;
        this.hoaDetails = e;
        this.nextAccordionStep();
        this.copyAllotSource = new MatTableDataSource(
            this.allotSource.filteredData.filter((data: any) => {
                return data.demandNo.toLowerCase().indexOf(e.demand) >= 0 && data.majorHead.toLowerCase().indexOf(e.major_head) >= 0 && data.submajorHead.toLowerCase().indexOf(e.sub_major_head) >= 0 && data.minorHead.toLowerCase().indexOf(e.minor_head) >= 0 && data.schemeHead.toLowerCase().indexOf(e.sub_head) >= 0 && data.detailHead.toLowerCase().indexOf(e.detailed_head) >= 0;
            })
        );
        this.copyAllotSource.paginator = this.paginator;
        this.copyAllotSource.sort = this.sort;
    }
}
