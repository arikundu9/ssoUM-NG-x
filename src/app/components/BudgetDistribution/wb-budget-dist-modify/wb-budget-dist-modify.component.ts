import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { authService } from '@S/auth.service';
import { CommonService } from '@S/common.service';
import { NotificationService } from '@S/notification.service';
import { ValidationService } from '@S/validation.service';

@Component({
    selector: 'app-wb-budget-dist-modify',
    templateUrl: './wb-budget-dist-modify.component.html',
    styleUrls: ['./wb-budget-dist-modify.component.css'],
})
export class WbBudgetDistModifyComponent implements OnInit {
    accordionStep = 0;
    modifyForm!: FormGroup;
    isAllotmentSelected: boolean = false;
    isModifyCilcked: boolean = false;
    isChangeAmtVerified: boolean = true;
    payloadDataForApprove: any[] = [];

    allotSource: any;
    clickedRows = new Set<any>();
    isRowClicked: boolean = false;
    displayedColumns: string[] = ['allotmentid', 'allotmentdate', 'receiverCode', 'hoa', 'balanceCeilamount', 'allotedAmount', 'selection'];

    private paginator!: MatPaginator;
    private sort!: MatSort;
    copyAllotSource: any;
    user: any;

    @ViewChild(MatSort) set matSort(ms: MatSort) {
        this.sort = ms;
    }
    @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
        this.paginator = mp;
    }

    constructor(private commonService: CommonService, private notify: NotificationService, private fb: FormBuilder, private validatorService: ValidationService, private auth: authService) {}

    ngOnInit(): void {
        this.getAllotment();
        this.modifyForm = this.fb.group({
            modifyFormArray: this.fb.array([]),
        });
        this.user = this.auth.user;
    }

    get modifyFormArray() {
        return this.modifyForm.controls['modifyFormArray'] as FormArray;
    }

    modifyFormArray_as_FormGroup(i: any): FormGroup {
        return this.modifyFormArray.controls[i] as FormGroup;
    }

    addModifyController() {
        this.modifyFormArray.clear();
        for (let i = 0; i < this.clickedRowsArray.length; i++) {
            const modifyFormStruct = this.fb.group({
                balance: this.validatorService.validation('Amount', 0, 100, ''),
            });
            modifyFormStruct.patchValue({ balance: this.clickedRowsArray[i].budgetAllotedAmount });
            this.modifyFormArray.push(modifyFormStruct);
        }
    }

    deleteModifyFormController(i: number) {
        this.modifyFormArray.removeAt(i);
        this.tickRow(null, this.clickedRowsArray[i]);
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
        this.addModifyController();
    }

    onHoaSearch() {
        this.nextAccordionStep();
    }

    getAllotment() {
        this.commonService.getNewAllotmentsForModify().subscribe((resp) => {
            console.log(resp);

            this.allotSource = this.copyAllotSource = new MatTableDataSource(resp);
            this.allotSource.paginator = this.paginator;
            this.allotSource.sort = this.sort;
        });
    }

    selectForModify() {
        if (this.clickedRowsArray.length > 0) {
            this.isModifyCilcked = true;
            this.addModifyController();
            this.nextAccordionStep();
        } else {
            this.notify.alert('Please select atleast one row..!');
        }
    }

    goForDelete() {
        if (this.clickedRowsArray.length > 0) {
            this.delete();
        } else {
            this.notify.alert('Please select atleast one row..!');
        }
    }

    get grandTotal() {
        let sum: number = 0;
        this.modifyForm.value.modifyFormArray.forEach((elm: any) => {
            if (elm != undefined) {
                sum = sum + elm.balance;
            }
        });
        return sum;
    }

    get clickedRowsArray(): any[] {
        return Array.from(this.clickedRows);
    }

    modify() {
        if (!this.isChangeAmtVerified) {
            this.notify.alert("Amount can't be more than Budget Ceiling Amount , Please check all the changeable Amount field carefully..!");
        } else if (!this.modifyForm.valid) {
            this.notify.alert('Please check all the fields carefully..!');
        } else {
            this.notify.confirmProposal('Do you want to modify?','').then((res) => {
                if (res) {
                    var payload: any[] = [];
                    for (let i = 0; i < this.clickedRowsArray.length; i++) {
                        var obj = {
                            allotmentId: this.clickedRowsArray[i].allotmentId,
                            fromAllotmentId: this.clickedRowsArray[i].fromAllotmentId,
                            budgetAllotedAmount: +this.modifyForm.value.modifyFormArray[i].balance,
                        };
                        payload.push(obj);
                    }
                    this.commonService.modifyAllotment(payload).subscribe((resp) => {
                        // if (resp.success) {
                        //     this.notify.successful('Allotments are modified successfully...!').then((res) => {
                        //         if (res) {
                        //             window.location.reload();
                        //         }
                        //     });
                        // }
                    });
                }
            });
        }
    }

    delete() {
        this.notify.confirmProposal('Are you sure ?', 'Do you really want to delete the grants?').then((res) => {
            if (res) {
                var payload: any[] = [];
                for (let i = 0; i < this.clickedRowsArray.length; i++) {
                    payload.push(this.clickedRowsArray[i].allotmentId);
                }
                this.commonService.deleteAllotments(payload).subscribe((resp) => {
                    // if (resp) {
                    //     this.notify.successful('Allotments are deleted successfully...!').then((res) => {
                    //         if (res) {
                    //             window.location.reload();
                    //         }
                    //     });
                    // }
                });
            }
        });
    }

    verifyChangableAmount(form: any[]) {
        for (let i = 0; i < form.length; i++) {
            if (this.clickedRowsArray[i].ceilingAmount - this.clickedRowsArray[i].provisionalReleasedAmount < form[i].value.balance) {
                this.isChangeAmtVerified = false;
                break;
            } else {
                this.isChangeAmtVerified = true;
            }
        }
    }

    showError(form: any, ceilAmt: number, relAmt: number) {
        if (ceilAmt - relAmt < form.value.balance) {
            this.notify.alert("Amount can't be greater than Ceiling Amount...!");
        }
    }

    filterHOA(e: any) {
        // this.isSearchDone = true;
        this.nextAccordionStep();
        this.copyAllotSource = new MatTableDataSource(
            this.allotSource.filteredData.filter((data: any) => {
                return data.demandNo.toLowerCase().indexOf(e.demand) >= 0 && data.majorHead.toLowerCase().indexOf(e.major_head) >= 0 && data.submajorHead.toLowerCase().indexOf(e.sub_major_head) >= 0 && data.minorHead.toLowerCase().indexOf(e.minor_head) >= 0 && data.schemeHead.toLowerCase().indexOf(e.sub_head) >= 0 && data.detailHead.toLowerCase().indexOf(e.detailed_head) >= 0;
            })
        );
        this.copyAllotSource.paginator = this.paginator;
        this.copyAllotSource.sort = this.sort;
    }

    sendForRevision() {
        if (this.clickedRowsArray.length > 0) {
            this.payloadDataForApprove = [];
            this.notify.confirmProposal('Are you sure ?', 'Do you really want to send this for revision?').then((res) => {
                if (res) {
                    this.clickedRowsArray.forEach((elem) => {
                        this.payloadDataForApprove.push(elem.allotmentId);
                    });
                    this.commonService.sendForRevision(this.payloadDataForApprove).subscribe((resp) => {
                        // this.notify.success(resp.message + '..!');
                        // this.router.navigate(['home']);
                    });
                }
            });
        } else {
            this.notify.alert('Please select atleast one row..!');
        }
    }
}
