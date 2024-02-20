import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EnumSanctionType } from '@C/common/enum';
import { CommonService } from '@S/common.service';
import { NotificationService } from '@S/notification.service';
import { ValidationService } from '@S/validation.service';

@Component({
    selector: 'app-wb-budget-dist-approve',
    templateUrl: './wb-budget-dist-approve.component.html',
    styleUrls: ['./wb-budget-dist-approve.component.css'],
})
export class WbBudgetDistApproveComponent implements OnInit {
    accordionStep = 0;

    allotSource: any;
    clickedRows = new Set<any>();
    isRowClicked: boolean = false;
    displayedColumns: string[] = ['allotmentid', 'allotmentdate', 'saoDdo', 'hoa', 'balanceCeilamount', 'allotedAmount', 'selection'];
    payloadDataForApprove: any[] = [];
    clickedRowsArray: any[] = [];

    private paginator!: MatPaginator;
    private sort!: MatSort;

    copyAllotSource: any;
    isSanctionAndApproveClicked: boolean = false;
    memoForm!: FormGroup;
    today = new Date();
    finalPayload: any;
    datePipeString: any;
    hoaDetails: any;

    @ViewChild(MatSort) set matSort(ms: MatSort) {
        this.sort = ms;
    }
    @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
        this.paginator = mp;
    }

    constructor(private commonService: CommonService, private notify: NotificationService, private router: Router, private validationService: ValidationService, private fb: FormBuilder, private datePipe: DatePipe) {}

    ngOnInit(): void {
        this.getAllotment();
        this.memoForm = this.fb.group({
            memoNo: this.validationService.validation('', 0, 100, ''),
            date: ['', Validators.required],
            remarks: this.validationService.validation('Not Required', 0, 500, ''),
            copyForward: this.fb.array([]),
        });
    }

    get clickedRowsAray() {
        return Array.from(this.clickedRows);
    }

    get copyForwardArray() {
        return this.memoForm.controls['copyForward'] as FormArray;
    }

    addcopyForwardController() {
        const copyFwrdFormStruct = this.fb.group({
            cf: ['', Validators.required],
        });
        this.copyForwardArray.push(copyFwrdFormStruct);
    }

    deletecopyForwardController(i: number) {
        this.copyForwardArray.removeAt(i);
    }

    get memoFormErrorControl() {
        return this.memoForm.controls;
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

    tickRow(event: any, row: any) {
        const rowSelected = this.clickedRows.size;
        this.clickedRows.has(row) ? this.clickedRows.delete(row) : this.clickedRows.add(row);
        if (this.clickedRows.size) this.isRowClicked = true;
        else this.isRowClicked = false;
    }

    onHoaSearch() {
        this.nextAccordionStep();
    }

    getAllotment() {
        this.commonService.getNewAllotments().subscribe((resp) => {
            this.allotSource = this.copyAllotSource = new MatTableDataSource(resp);
            this.allotSource.paginator = this.paginator;
            this.allotSource.sort = this.sort;
        });
    }

    goForApprove() {
        this.clickedRowsArray = Array.from(this.clickedRows);
        if (this.clickedRowsArray.length > 0) {
            this.approve();
        } else {
            this.notify.alert('Please select atleast one row..!');
        }
    }

    approve() {
        this.payloadDataForApprove = [];
        this.notify.confirmProposal('Do you want to modify?', '').then((res) => {
            if (res) {
                this.clickedRowsArray = Array.from(this.clickedRows);
                this.clickedRowsArray.forEach((elem) => {
                    this.payloadDataForApprove.push(elem.allotmentId);
                });
                this.commonService.approveAllotments(this.payloadDataForApprove).subscribe((resp) => {
                    // this.notify.success(resp.message + '..!');
                    // this.router.navigate(['home']);
                });
            }
        });
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

    goForApproveAndSanction() {
        if (this.clickedRowsAray.length > 0) {
            this.isSanctionAndApproveClicked = true;
            this.nextAccordionStep();
            this.memoForm.patchValue({
                date: this.today,
            });
        } else {
            this.notify.alert('Please select atleast one row..!');
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

                    for (let i = 0; i < this.memoForm.value.copyForward.length; i++) {
                        copyArray.push(this.memoForm.value.copyForward[i].cf);
                    }
                    this.clickedRowsAray.forEach((elem) => {
                        idArray.push(elem.allotmentId);
                        sum = sum + elem.budgetAllotedAmount;
                    });

                    this.finalPayload = {
                        allotmentIds: idArray,
                        memoNumber: this.memoForm.value.memoNo,
                        memoDate: this.datePipeString,
                        remarks: this.memoForm.value.remarks,
                        copyTo: copyArray,
                        majorHead: this.hoaDetails.major_head,
                        sanctionAmount: sum,
                        sanctionType: EnumSanctionType.Allotment,
                        transactionType: 0, // 1 for Revoke & 0 for Release.
                        sanctionStatus: 1, // 1 for sanction.
                    };
                    this.commonService.sanctionAllotments(this.finalPayload).subscribe({
                        next: (res) => {
                            this.decodeAndDownloadPdf(res.sanctionLetterFile);
                            this.notify.success('Sanction letter generated successfully.');
                        },
                        error: (er) => {
                            console.log(er);
                        },
                    });
                }
            });
        }
    }

    draftAllotments() {
        if (!this.memoForm.valid) {
            this.notify.alert('Please check all the fields carefully..!');
            this.memoForm.markAllAsTouched();
        } else {
            this.notify.confirmProposal('Are you sure ?', 'Do you really want to save as draft?').then((res) => {
                if (res) {
                    let idArry: any[] = [];
                    let copyArry: any[] = [];
                    let s: number = 0;

                    this.datePipeString = this.datePipe.transform(this.memoForm.value.date, 'yyyy-MM-dd');

                    for (let i = 0; i < this.memoForm.value.copyForward.length; i++) {
                        copyArry.push(this.memoForm.value.copyForward[i].cf);
                    }

                    this.clickedRowsAray.forEach((elem) => {
                        idArry.push(elem.allotmentId);
                        s = s + elem.budgetAllotedAmount;
                    });

                    this.finalPayload = {
                        allotmentIds: idArry,
                        memoNumber: this.memoForm.value.memoNo,
                        memoDate: this.datePipeString,
                        remarks: this.memoForm.value.remarks,
                        copyTo: copyArry,
                        majorHead: this.hoaDetails.major_head,
                        sanctionAmount: s,
                        sanctionType: EnumSanctionType.Allotment,
                        transactionType: 0,
                        sanctionStatus: 1, // 1 for sanction.
                    };
                }
                this.commonService.draftSanctionAllotments(this.finalPayload).subscribe({
                    next: (res) => {
                        this.decodeAndDownloadPdf(res.sanctionLetterFile);
                        this.notify.success('Allotments are drafted successfully..!');
                    },
                    error: (er) => {
                        // console.log(er);
                    },
                });
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
}
