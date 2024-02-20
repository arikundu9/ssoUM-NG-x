import { CommonDialogComponent } from '@C/common/common-dialog/common-dialog.component';
import { authService } from '@S/auth.service';
import { CommonService } from '@S/common.service';
import { NotificationService } from '@S/notification.service';
import { ValidationService } from '@S/validation.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FromArrayHelper } from 'app/helper/utils';

@Component({
    selector: 'app-action-on-auto-allotment',
    templateUrl: './action-on-auto-allotment.component.html',
    styleUrls: ['./action-on-auto-allotment.component.scss'],
})
export class ActionOnAutoAllotmentComponent implements OnInit {
    accordionStep = 0;
    allotSource: any;
    clickedRows = new Set<any>();
    isRowClicked: boolean = false;
    displayedColumns: string[] = ['selection', 'id', 'hoa', 'saoDdoCode', 'autoallotmentamount', 'action'];
    copyAllotSource: any;
    autoAllotmentFormArrayHelper!: FromArrayHelper;
    autoAllotmentActionForm!: FormGroup;
    private paginator!: MatPaginator;
    private sort!: MatSort;
    objectAllotmentPayloadArray: any[] = [];
    hoaData: any;
    treasuryList: any[] = [];
    copyTreasuryList: any[] = [];
    ddoList: any[] = [];
    copyDdoList: any[] = [];
    selectedTreasury: any;

    @ViewChild(MatSort) set matSort(ms: MatSort) {
        this.sort = ms;
    }
    @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
        this.paginator = mp;
    }

    constructor(private commonService: CommonService, private notify: NotificationService, private fb: FormBuilder, private validatorService: ValidationService, private auth: authService, private datePipe: DatePipe, private router: Router, public dialog: MatDialog) {}

    ngOnInit(): void {
        this.autoAllotmentActionForm = this.fb.group({
            autoAllotmentActionFormArray: this.fb.array([]),
            tresuryCode: [''],
            ddoCode: [''],
        });
        this.autoAllotmentFormArrayHelper = new FromArrayHelper(this.autoAllotmentActionForm.controls.autoAllotmentActionFormArray, {
            objectionRemarks: [, [Validators.required]],
        });
        this.getAllTreasury();
    }

    get clickedRowsArray(): any[] {
        return Array.from(this.clickedRows);
    }

    getAutoallotmentData() {
        let autoAllotFilterCriteria = {
            demandNo: this.hoaData?.demand == '' ? null : this.hoaData?.demand,
            majorHead: this.hoaData?.major_head == '' ? null : this.hoaData?.major_head,
            submajorHead: this.hoaData?.sub_major_head == '' ? null : this.hoaData?.sub_major_head,
            minorHead: this.hoaData?.minor_head == '' ? null : this.hoaData?.minor_head,
            schemeHead: this.hoaData?.sub_head == '' ? null : this.hoaData?.sub_head,
            detailHead: this.hoaData?.detailed_head == '' ? null : this.hoaData?.detailed_head,
            subdetailHead: this.hoaData?.subDetailHead == '' ? null : this.hoaData?.subDetailHead,
            votedCharged: this.hoaData?.votedCharged == '' ? null : this.hoaData?.votedCharged,
            ddoCode: this.autoAllotmentActionForm.value.ddoCode.code,
            treasuryCode: this.autoAllotmentActionForm.value.tresuryCode.code,
        };
        this.commonService.getCreatedAutoAllotmentData(autoAllotFilterCriteria).subscribe((resp) => {
            this.allotSource = this.copyAllotSource = new MatTableDataSource(resp);
            this.allotSource.paginator = this.paginator;
            this.allotSource.sort = this.sort;
        });
        this.nextAccordionStep();
    }

    addAutoAllotmentFormController() {
        this.autoAllotmentFormArrayHelper.clear();
        for (let i = 0; i < this.clickedRowsArray.length; i++) {
            this.autoAllotmentFormArrayHelper.addControl();
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

    goForAutoAllotmentObjection() {
        if (this.clickedRowsArray.length > 0) {
            this.addAutoAllotmentFormController();
            this.nextAccordionStep();
        } else {
            this.notify.alert('Please select atleast one row..!');
        }
    }

    deleteFormArrayEntry(i: number) {
        this.clickedRows.delete(this.clickedRowsArray[i]);
        this.autoAllotmentFormArrayHelper.deleteControlAt(i);
    }

    openDialog(enterAnimationDuration: string, exitAnimationDuration: string, elmId: number): void {
        console.log(elmId);
        this.dialog.open(CommonDialogComponent, {
            width: '450px',
            enterAnimationDuration,
            exitAnimationDuration,
            data: {
                mode: 'View Auto Allotment Objection',
                elementId: elmId,
            },
        });
    }

    filterHOA(e: any) {
        this.hoaData = e;
    }

    getAllTreasury() {
        this.commonService.getAllTreasury().subscribe((resp) => {
            this.treasuryList = this.copyTreasuryList = resp;
        });
    }

    searchTreasury(e: any) {
        if (e !== undefined) {
            let term = '';
            if (e.target.value.length > 0) {
                term = e.target.value;
            }
            if (term !== undefined && term !== '' && term != null) {
                if (term.length > 0) {
                    this.treasuryList = this.copyTreasuryList.filter((data: any) => {
                        return data.districtName.toLowerCase().indexOf(term.toLowerCase()) >= 0 || data.code.toLowerCase().indexOf(term.toLowerCase()) >= 0;
                    });
                }
            } else {
                this.treasuryList = this.copyTreasuryList;
            }
        }
    }

    onTreasurySelect(e: any, treasuryCode: any, i: any) {
        if (e.isUserInput) {
            this.selectedTreasury = treasuryCode;
        }
    }

    bindDdoForSelectedTreasury() {
        this.commonService.getDdoByTreasury(this.selectedTreasury).subscribe((resp) => {
            this.ddoList = this.copyDdoList = resp;
        });
    }

    searchDdo(e: any) {
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

    displayFnTreasury(v: any): string {
        return v != null && v.id != null ? v.code + ' : ' + v.districtName : '';
    }

    displayFnDdoCode(v: any): string {
        return v != null && v.id != null ? v.code + ' : ' + v.designation : '';
    }

    objectAllotment() {
        if (this.autoAllotmentActionForm.valid) {
            this.objectAllotmentPayloadArray = [];
            this.notify.confirmProposal('Are you sure ?', 'Do you want to object the allotments ?').then((res) => {
                if (res) {
                    this.autoAllotmentFormArrayHelper.controls.forEach((elm: any, i: number) => {
                        let payload = {
                            autoAllotmentId: this.clickedRowsArray[i]?.allotmentId,
                            comment: elm.value.objectionRemarks,
                            isObjected: true,
                        };
                        this.objectAllotmentPayloadArray.push(payload);
                    });
                    this.commonService.createObjectionOnAutoAllotment(this.objectAllotmentPayloadArray).subscribe((resp) => {});
                }
            });
        } else {
            this.notify.alert('Please fill all fields carefully..!');
        }
    }
}
