import { CommonService } from '@S/common.service';
import { NotificationService } from '@S/notification.service';
import { ValidationService } from '@S/validation.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-revoke-entry',
    templateUrl: './revoke-entry.component.html',
    styleUrls: ['./revoke-entry.component.scss'],
})
export class RevokeEntryComponent implements OnInit {
    withdrawalForm!: FormGroup;

    isSaoSelected: boolean = true;
    saoHeirarchyList: any[] = [];
    saoList: any[] = [];
    copySaoList: any[] = [];
    isSaoHeirerchySelected: boolean = false;
    saoLevel: any;
    selectedReceiver: any;
    ddoList: any[] = [];
    copyDdoList: any[] = [];
    accordionStep = 0;
    allSanctionedData: any[] = [];
    isInsertClicked: boolean = false;

    allotSource: any;
    clickedRows = new Set<any>();
    isRowClicked: boolean = false;
    displayedColumns: string[] = ['allotmentId', 'allotmentdate', 'sao', 'hoa', 'memoNo', 'totalAmt', 'balanceamount', 'selection'];

    private paginator!: MatPaginator;
    private sort!: MatSort;
    copyAllotSource: any;

    @ViewChild(MatSort) set matSort(ms: MatSort) {
        this.sort = ms;
    }
    @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
        this.paginator = mp;
    }

    constructor(private fb: FormBuilder, private commonService: CommonService, private notify: NotificationService, private validatorService: ValidationService) {}

    ngOnInit(): void {
        this.withdrawalForm = this.fb.group({
            saoDdo: [''],
            ddoCode: [''],
            saoHeirerchy: [''],
            sao: [''],
            withdrawalFormArray: this.fb.array([]),
        });
        this.getSaoHeirarchy();
        this.getSanctionedAllotments();
    }

    get clickedRowsArray(): any[] {
        return Array.from(this.clickedRows);
    }

    selectForModify() {
        if (this.clickedRowsArray.length > 0) {
            this.isInsertClicked = true;
            this.insertIntoAmmountAccrodion();
            this.nextAccordionStep();
        } else {
            this.notify.alert('Please select atleast one row..!');
        }
    }

    insertIntoAmmountAccrodion() {
        this.withdrawalFormArray.clear();
        for (let i = 0; i < this.clickedRowsArray.length; i++) {
            const withdrawalFormStruct = this.fb.group({
                balance: this.validatorService.validation('Amount', 0, 100, ''),
            });
            this.withdrawalFormArray.push(withdrawalFormStruct);
        }
    }

    get withdrawalFormArray() {
        return this.withdrawalForm.controls['withdrawalFormArray'] as FormArray;
    }

    withdrawalFormArray_as_FormGroup(i: any): FormGroup {
        const formGroup = this.withdrawalFormArray.controls[i] as FormGroup;
        return formGroup;
    }

    deletewithdrawalFormController(i: number) {
        this.withdrawalFormArray.removeAt(i);
        this.tickRow(null, this.clickedRowsArray[i]);
    }

    get grandTotal() {
        let sum: number = 0;
        this.withdrawalForm.value.withdrawalFormArray.forEach((elm: any) => {
            if (elm.balance != undefined) {
                sum = sum + elm.balance;
            }
        });
        return sum;
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

    searchForAllotments() {
        this.nextAccordionStep();
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

    tickRow(event: any, row: any) {
        const rowSelected = this.clickedRows.size;
        this.clickedRows.has(row) ? this.clickedRows.delete(row) : this.clickedRows.add(row);
        if (this.clickedRows.size) this.isRowClicked = true;
        else this.isRowClicked = false;
        this.insertIntoAmmountAccrodion();
    }

    onSaoButtonSelect() {
        this.withdrawalForm.controls['ddoCode'].reset();
        this.bindDdoForSelectedTreasury();
    }

    onDdoButtonSelect() {
        this.withdrawalForm.controls['saoHeirerchy'].reset();
        this.bindDdoForSelectedTreasury();
    }

    getSaoHeirarchy() {
        this.commonService.getSaoHeirarchy().subscribe((resp) => {
            this.saoHeirarchyList = resp;
        });
    }

    onSaoHeirerchySelect(e: any, sao: any) {
        if (e.isUserInput) {
            this.saoLevel = sao.code;
            this.getAllSao();
            this.isSaoHeirerchySelected = true;
            this.withdrawalForm.controls['sao'].reset();
        }
    }

    getAllSao() {
        this.commonService.getSaoByHeirarchy(this.saoLevel).subscribe((resp) => {
            // console.log(resp);
            this.saoList = this.copySaoList = resp;
        });
    }

    searchSao(e: any) {
        var i = e.target.getAttribute('i');
        if (e !== undefined) {
            let term = '';
            if (e.target.value.length > 0) {
                term = e.target.value;
            }
            if (term !== undefined && term !== '' && term != null) {
                if (term.length > 0) {
                    this.saoList = this.copySaoList.filter((data: any) => {
                        return data.name.toLowerCase().indexOf(term.toLowerCase()) >= 0 || data.code.toLowerCase().indexOf(term.toLowerCase()) >= 0;
                    });
                }
            } else {
                this.saoList = this.copySaoList;
            }
        }
    }

    bindDdoForSelectedTreasury() {
        this.commonService.getDdoByTreasury('UDA').subscribe((resp) => {
            this.ddoList = this.copyDdoList = resp;
        });
    }

    searchDdo(e: any) {
        var i = e.target.getAttribute('i');
        if (e !== undefined) {
            let term = '';
            if (e.target.value.length > 0) {
                term = e.target.value;
            }
            if (term !== undefined && term !== '' && term != null) {
                if (term.length > 0) {
                    this.ddoList = this.copyDdoList.filter((data: any) => {
                        return data.designation.toLowerCase().indexOf(term.toLowerCase()) >= 0 || data.code.toLowerCase().indexOf(term.toLowerCase()) >= 0;
                    });
                }
            } else {
                this.ddoList = this.copyDdoList;
            }
        }
    }

    getSanctionedAllotments() {
        this.commonService.getAllotmentsForRevoke().subscribe((resp) => {
            this.allSanctionedData = resp;
            this.allotSource = this.copyAllotSource = new MatTableDataSource(resp);
            this.allotSource.paginator = this.paginator;
            this.allotSource.sort = this.sort;
            // console.log(this.allSanctionedData);
        });
    }

    revokeAllotments() {
        if (!this.withdrawalForm.valid) {
            this.notify.alert('Please check all the field carefully..!');
            this.withdrawalForm.markAllAsTouched();
        } else {
            this.notify.confirmProposal('Do you want to withdraw fund?', '').then((res) => {
                if (res) {
                    var payload: any[] = [];
                    for (let i = 0; i < this.clickedRowsArray.length; i++) {
                        var obj = {
                            fromAllotmentId: this.clickedRowsArray[i].allotmentId,
                            // toAllotmentId: this.clickedRowsArray[i].fromAllotmentId,
                            withdrawlAmount: +this.withdrawalForm.value.withdrawalFormArray[i].balance,
                        };
                        payload.push(obj);
                    }
                    this.commonService.submitBudgetRevoke(payload).subscribe((resp) => {
                        // if (resp.success) {
                        // this.notify.successful('Allotments are modified successfully...!').then((res) => {
                        //     if (res) {
                        //         window.location.reload();
                        //     }
                        // });
                        // }
                    });
                }
            });
        }
    }

    filterHOA(e: any) {
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
