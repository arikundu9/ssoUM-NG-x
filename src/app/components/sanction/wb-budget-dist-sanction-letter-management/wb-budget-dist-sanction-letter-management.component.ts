import { EnumSanctionType } from '@C/common/enum';
import { CommonService } from '@S/common.service';
import { NotificationService } from '@S/notification.service';
import { ValidationService } from '@S/validation.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
    selector: 'app-wb-budget-dist-sanction-letter-management',
    templateUrl: './wb-budget-dist-sanction-letter-management.component.html',
    styleUrls: ['./wb-budget-dist-sanction-letter-management.component.scss'],
})
export class WbBudgetDistSanctionLetterManagementComponent implements OnInit {
    sanctionForm!: FormGroup;
    memoForm!: FormGroup;
    allotmentTypeForm!: FormGroup;

    allotSource: any;
    clickedRows = new Set<any>();
    isRowClicked: boolean = false;
    displayedColumns: string[] = ['allotmentId', 'alootmentDate', 'saoDdoCode', 'hoa', 'amount', 'selection'];
    accordionStep = 0;
    isReprintClicked: boolean = false;
    demandCodeList: any[] = [];
    copyDemandCodeList: any[] = [];
    demandCode!: string;
    majorHeadList: any[] = [];
    copyMajorHeadList: any[] = [];
    approvedData: any[] = [];
    clickedRowsArray: any[] = [];
    today = new Date();
    isAllotmentSelected: boolean = false;
    isSearchClicked: boolean = false;
    isSanctionedClicked: boolean = false;
    finalPayload: any;
    datePipeString: any;
    blob: any;
    isWithDrawalClicked: boolean = false;
    sanctionedData: any[] = [];
    memoList: any[] = [];
    isMemoSelected: boolean = false;
    filteredData: any[] = [];

    private paginator!: MatPaginator;
    private sort!: MatSort;

    @ViewChild(MatSort) set matSort(ms: MatSort) {
        this.sort = ms;
    }
    @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
        this.paginator = mp;
    }
    constructor(private commonService: CommonService, private notify: NotificationService, private fb: FormBuilder, private router: Router, private datePipe: DatePipe, private validationService: ValidationService) {}

    ngOnInit(): void {
        this.sanctionForm = this.fb.group({
            demandCode: this.validationService.validation('Not Required', 0, 100, ''),
            majorHead: this.validationService.validation('Not Required', 0, 100, ''),
            memoNumber: this.validationService.validation('', 0, 100, ''),
            dateFrom: [''],
            dateTo: [''],
        });

        this.memoForm = this.fb.group({
            memoNo: this.validationService.validation('', 0, 100, ''),
            date: ['', Validators.required],
            nameOfProject: ['As per annexure enclosed'],
            puprposeOfSanction: [''],
            administrativeOrderNo: [''],
            administrativeOrderDate: [''],
            adminApprovalAmt: [''],
            authority: [''],
            totalFundSanction: [''],
            ucType: ['no'],
            fdGroup: [''],
            remarks: this.validationService.validation('Not Required', 0, 500, ''),
            copyForward: this.fb.array([]),
        });

        this.allotmentTypeForm = this.fb.group({
            allotmentType: [0, Validators.required],
            printType: ['', Validators.required],
        });

        this.getDepartments();
    }

    get memoFormErrorControl() {
        return this.memoForm.controls;
    }

    get sanctionFormErrorControl() {
        return this.sanctionForm.controls;
    }

    get getEnumSanctionType() {
        return EnumSanctionType;
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

    rePrint() {
        this.isReprintClicked = true;
        this.commonService.getAllSanctionedData().subscribe((resp) => {
            this.sanctionedData = resp;
            this.memoList = resp.map((elm: any) => elm.memoNumber);
        });
    }

    newPrint() {
        this.isReprintClicked = false;
    }

    getDepartments() {
        this.commonService.getDemandData().subscribe((res) => {
            this.demandCodeList = this.copyDemandCodeList = res;
            if (this.demandCodeList.length === 0) {
                this.notify.alert('No value available for the selected combination');
            }
        });
    }

    searchDemand(e: any) {
        if (e !== undefined) {
            let term = '';
            if (e.target.value.length > 0) {
                term = e.target.value;
            }
            if (term !== undefined && term !== '' && term != null) {
                if (term.length > 0) {
                    this.demandCodeList = this.copyDemandCodeList?.filter((data: any) => {
                        return data.name?.toLowerCase().indexOf(term.toLowerCase()) >= 0 || data.demandCode.toLowerCase().indexOf(term.toLowerCase()) >= 0;
                    });
                }
            } else {
                this.demandCodeList = this.copyDemandCodeList;
            }
        }
    }

    onDemandSelect(e: any, demandId: string) {
        if (e.isUserInput) {
            this.demandCode = demandId;
        }
    }

    getMajorHead() {
        this.commonService.getMajorHead(this.demandCode).subscribe((res) => {
            this.majorHeadList = this.copyMajorHeadList = res;
            if (this.majorHeadList.length === 0) {
                this.notify.alert('No value available for the selected combination');
            }
        });
    }

    searchMajorHead(e: any) {
        if (e !== undefined) {
            let term = '';
            if (e.target.value.length > 0) {
                term = e.target.value;
            }
            if (term !== undefined && term !== '' && term != null) {
                if (term.length > 0) {
                    this.majorHeadList = this.copyMajorHeadList?.filter((data: any) => {
                        return data.majorhead_name?.toLowerCase().indexOf(term.toLowerCase()) >= 0 || data.majorheadcode.toLowerCase().indexOf(term.toLowerCase()) >= 0;
                    });
                }
            } else {
                this.majorHeadList = this.copyMajorHeadList;
            }
        }
    }

    searchForSanction() {
        // if (!this.sanctionForm.controls['majorHead'].valid) {
        //     this.notify.alert('Please select Demand Code and Major Head..!');
        //     this.sanctionForm.controls['demandCode'].markAsTouched();
        //     this.sanctionForm.controls['majorHead'].markAsTouched();
        // } else {
        this.allotSource = null;
        if (this.allotmentTypeForm.value.allotmentType === EnumSanctionType.Withdrawl) {
            this.getWithdrawalData();
        } else {
            this.getApprovedData();
        }
        this.nextAccordionStep();
        this.isSearchClicked = true;
        // }
    }

    getApprovedData() {
        this.commonService.getApprovedAllotments().subscribe((resp) => {
            // console.log(resp);
            this.allotSource = new MatTableDataSource(resp);
            this.allotSource.paginator = this.paginator;
            this.allotSource.sort = this.sort;
        });
    }

    getWithdrawalData() {
        this.commonService.getWithdrawalAllotments().subscribe((resp) => {
            // console.log(resp);
            this.allotSource = new MatTableDataSource(resp);
            this.allotSource.paginator = this.paginator;
            this.allotSource.sort = this.sort;
        });
    }

    goForSanction() {
        this.clickedRowsArray = Array.from(this.clickedRows);
        if (this.clickedRowsArray.length === 0) {
            this.notify.alert('Please select atleast one row..!');
        } else {
            this.nextAccordionStep();
            this.isAllotmentSelected = true;
        }
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

    sanctionAllotments() {
        if (!this.memoForm.valid) {
            this.notify.alert('Please check all the fields carefully..!');
            this.memoForm.markAllAsTouched();
        } else {
            // this.notify.confirmProposal('Are you sure ?', 'Do you really want to generate sanction?').then((res) => {
            //     if (res) {
            let idArray: any[] = [];
            let copyArray: any[] = [];
            let sum: number = 0;

            this.datePipeString = this.datePipe.transform(this.memoForm.value.date, 'yyyy-MM-dd');

            for (let i = 0; i < this.memoForm.value.copyForward.length; i++) {
                copyArray.push(this.memoForm.value.copyForward[i].cf);
            }

            if (this.allotmentTypeForm.value.allotmentType === EnumSanctionType.Withdrawl) {
                this.clickedRowsArray.forEach((elem) => {
                    idArray.push(elem.withdrawlId);
                    sum = sum + elem.withdrawlAmount;
                });

                this.finalPayload = {
                    withdrawlIds: idArray,
                    memoNumber: this.memoForm.value.memoNo,
                    memoDate: this.datePipeString,
                    remarks: this.memoForm.value.remarks,
                    copyTo: copyArray,
                    majorHead: this.sanctionForm.value.majorHead,
                    sanctionAmount: sum,
                    sanctionType: +this.allotmentTypeForm.value.allotmentType,
                    transactionType: 1, // 1 for Revoke & 0 for Release.
                    sanctionStatus: 1, // 1 for sanction.
                };

                this.notify.confirmProposal('Do you want to generate sanction letter for withdrawal?', '').then((res) => {
                    if (res) {
                        this.commonService.sanctionWithdrawalledAllotments(this.finalPayload).subscribe({
                            next: (res) => {
                                this.decodeAndDownloadPdf(res.sanctionLetterFile);
                                // this.notify.success('Sanction letter for withdrawal is generated successfully.');
                            },
                            error: (er) => {
                                console.log(er);
                            },
                        });
                    }
                });
            } else if (this.allotmentTypeForm.value.allotmentType === EnumSanctionType.Sanction) {
                //This payload will be different said by Krishnendu Sir.
            } else {
                this.clickedRowsArray.forEach((elem) => {
                    idArray.push(elem.allotmentId);
                    sum = sum + elem.budgetAllotedAmount;
                });

                this.finalPayload = {
                    allotmentIds: idArray,
                    memoNumber: this.memoForm.value.memoNo,
                    memoDate: this.datePipeString,
                    remarks: this.memoForm.value.remarks,
                    copyTo: copyArray,
                    majorHead: this.sanctionForm.value.majorHead,
                    sanctionAmount: sum,
                    sanctionType: +this.allotmentTypeForm.value.allotmentType,
                    transactionType: 0, // 1 for Revoke & 0 for Release.
                    sanctionStatus: 1, // 1 for sanction.
                };

                this.notify.confirmProposal('Do you want to generate sanction letter for allotment?', '').then((res) => {
                    if (res) {
                        this.commonService.sanctionAllotments(this.finalPayload).subscribe({
                            next: (res) => {
                                console.log(res);
                                this.decodeAndDownloadPdf(res.sanctionLetterFile);
                                // this.notify.success('Allotments are sanctioned successfully..!');
                            },
                            error: (er) => {
                                console.log(er);
                            },
                        });
                    }
                });
            }
            //     }
            // });
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

                    if (this.allotmentTypeForm.value.allotmentType === EnumSanctionType.Withdrawl) {
                        this.clickedRowsArray.forEach((elem) => {
                            idArry.push(elem.withdrawlId);
                            s = s + elem.withdrawlAmount;
                        });

                        this.finalPayload = {
                            withdrawlIds: idArry,
                            memoNumber: this.memoForm.value.memoNo,
                            memoDate: this.datePipeString,
                            remarks: this.memoForm.value.remarks,
                            copyTo: copyArry,
                            majorHead: this.sanctionForm.value.majorHead,
                            sanctionAmount: s,
                            sanctionType: +this.allotmentTypeForm.value.allotmentType,
                            transactionType: 1, // 1 for Revoke & 0 for Release.
                            sanctionStatus: 1, // 1 for sanction.
                        };
                    } else if (this.allotmentTypeForm.value.allotmentType === EnumSanctionType.Sanction) {
                        //This payload will be different said by Krishnendu Sir.
                    } else {
                        this.clickedRowsArray.forEach((elem) => {
                            idArry.push(elem.allotmentId);
                            s = s + elem.budgetAllotedAmount;
                        });

                        this.finalPayload = {
                            allotmentIds: idArry,
                            memoNumber: this.memoForm.value.memoNo,
                            memoDate: this.datePipeString,
                            remarks: this.memoForm.value.remarks,
                            copyTo: copyArry,
                            majorHead: this.sanctionForm.value.majorHead,
                            sanctionAmount: s,
                            sanctionType: +this.allotmentTypeForm.value.allotmentType,
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
                }
            });
        }
    }

    getMemo(e: any, memoNo: string) {
        if (e.isUserInput) {
            this.filteredData = this.sanctionedData.filter((elm) => elm.memoNumber === memoNo);
        }
    }

    generateReport() {
        if (this.isMemoSelected) {
            this.downloadPdf(this.filteredData[0].sanctionLetterFile);
        } else {
            this.notify.alert('Please select the memo number..!');
            this.sanctionForm.controls['memoNumber'].markAsTouched();
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
        // console.clear();
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
