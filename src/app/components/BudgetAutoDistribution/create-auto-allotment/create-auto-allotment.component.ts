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
    selector: 'app-create-auto-allotment',
    templateUrl: './create-auto-allotment.component.html',
    styleUrls: ['./create-auto-allotment.component.scss'],
})
export class CreateAutoAllotmentComponent implements OnInit {
    accordionStep = 0;
    allotSource: any;
    clickedRows = new Set<any>();
    isRowClicked: boolean = false;
    displayedColumns: string[] = ['id', 'saoDdoCode', 'hoa', 'percentage', 'selection'];
    copyAllotSource: any;
    autoAllotmentFormArrayHelper!: FromArrayHelper;
    autoAllotmentForm!: FormGroup;
    private paginator!: MatPaginator;
    private sort!: MatSort;
    autoAllotmentPayloadArray: any[] = [];
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

    constructor(private commonService: CommonService, private notify: NotificationService, private fb: FormBuilder, private validatorService: ValidationService, private auth: authService, private datePipe: DatePipe, private router: Router) {}

    ngOnInit(): void {
        this.autoAllotmentForm = this.fb.group({
            numberOfDays: [, Validators.required],
            tresuryCode: [''],
            ddoCode: [''],
            requisitionFormArray: this.fb.array([]),
        });
        this.autoAllotmentFormArrayHelper = new FromArrayHelper(this.autoAllotmentForm.controls.requisitionFormArray, {
            autoAllotmentPercentage: [, [Validators.required]],
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
            ddoCode: this.autoAllotmentForm.value.ddoCode.code,
            treasuryCode: this.autoAllotmentForm.value.tresuryCode.code,
        };
        this.commonService.getAutoAllotmentHistory(autoAllotFilterCriteria).subscribe((resp) => {
            this.allotSource = this.copyAllotSource = new MatTableDataSource(resp);
            this.allotSource.paginator = this.paginator;
            this.allotSource.sort = this.sort;
            // this.masterToggle();
        });
        this.nextAccordionStep();
    }

    addAutoAllotmentFormController() {
        this.autoAllotmentFormArrayHelper.clear();
        for (let i = 0; i < this.clickedRowsArray.length; i++) {
            this.autoAllotmentFormArrayHelper.addControl();
            this.autoAllotmentFormArrayHelper.fromGroupAt(i).patchValue({
                autoAllotmentPercentage: this.clickedRowsArray[i].avgPercentage,
            });
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

    get totalPercentage(): number {
        let s: number = 0;
        this.autoAllotmentFormArrayHelper.controls.forEach((elm: any) => {
            if (elm != undefined) {
                s = s + elm.value.autoAllotmentPercentage;
            }
        });
        return s;
    }

    goForAutoAllotment() {
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

    autoAllot() {
        if (this.autoAllotmentForm.valid) {
            this.autoAllotmentPayloadArray = [];
            if (this.totalPercentage === 100) {
                this.notify.confirmProposal('Are you sure ?', "The allotments if not objected by SAO's before the mentioned blocking time, will be treated as approved and actual allotments will be released to respective DDO's..!").then((res) => {
                    if (res) {
                        this.autoAllotmentFormArrayHelper.controls.forEach((elm: any, i: number) => {
                            let payload = {
                                id: this.clickedRowsArray[i]?.id,
                                avgPercentage: elm.value.autoAllotmentPercentage,
                            };
                            this.autoAllotmentPayloadArray.push(payload);
                        });
                        this.commonService.createAutoAllotment(this.autoAllotmentPayloadArray).subscribe((resp) => {});
                    }
                });
            } else {
                this.notify.alert('Sum of distribution amount must be 100, if one is changed it is necessary to balance that out..!');
            }
        } else {
            this.notify.alert('Please fill all fields carefully..!');
        }
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
        var i = e.target.getAttribute('i');
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

    displayFnTreasury(v: any): string {
        return v != null && v.id != null ? v.code + ' : ' + v.districtName : '';
    }

    displayFnDdoCode(v: any): string {
        return v != null && v.id != null ? v.code + ' : ' + v.designation : '';
    }
}
