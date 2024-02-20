import { EnumReleaseMapType, UserType } from '@C/common/enum';
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
    selector: 'app-wb-budget-redist-entry',
    templateUrl: './wb-budget-redist-entry.component.html',
    styleUrls: ['./wb-budget-redist-entry.component.scss'],
})
export class WbBudgetRedistEntryComponent implements OnInit {
    accordionStep = 0;
    allotSource: any;
    clickedRows = new Set<any>();
    isRowClicked: boolean = false;
    displayedColumns: string[] = ['allotmentid', 'allotmentdate', 'saoDdo', 'hoa', 'balanceCeilamount', 'allotedAmount', 'selection'];
    private paginator!: MatPaginator;
    private sort!: MatSort;
    copyAllotSource: any;
    hoaDetails: any;
    reDistributionForm!: FormGroup;
    departmentList: any[] = [];
    receiverFormArrayHelper!: FromArrayHelper;

    @ViewChild(MatSort) set matSort(ms: MatSort) {
        this.sort = ms;
    }
    @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
        this.paginator = mp;
    }

    constructor(private commonService: CommonService, private notify: NotificationService, private router: Router, private validationService: ValidationService, private fb: FormBuilder, private datePipe: DatePipe) {}

    ngOnInit(): void {
        this.getAllotment();
        this.reDistributionForm = this.fb.group({
            allotmentType: [1],
            schemeType: [],
            allotmentId: [],
            receiverForm: this.fb.array([]),
        });
        this.receiverFormArrayHelper = new FromArrayHelper(this.reDistributionForm.controls['receiverForm'], {
            deptDetails: [],
            amount: [],
        });
        this.receiverFormArrayHelper.addControl();
    }

    getAllotment() {
        //[MODIFICATION 1] //4. Re-distribution only for own demand number.[10_01_24.pdf]   ::  FILTER ADDED
        //[MODIFICATION 2] //4) In case of Budget Redistribution, SAO should be able to allocate fund of its own demand no. / or other demand no. to any SAO/DDO regardless of the recipient's Deptt code/Demand no. [ScannedDoc_24-Jan-2024.pdf]

        this.commonService.getMyAllotments().subscribe((resp) => {
            this.allotSource = this.copyAllotSource = new MatTableDataSource(
                resp.filter((elem: any) => {
                    if (elem.deptCode == this.commonService.deptCode) {
                        return elem;
                    }
                })
            );
            this.allotSource.paginator = this.paginator;
            this.allotSource.sort = this.sort;
        });
    }

    get clickedRowsAray() {
        return Array.from(this.clickedRows);
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
        if (rowSelected > 0) {
            this.clickedRows.clear();
        }
        this.clickedRows.add(row);
        this.isRowClicked = true;
    }

    onHoaSelect() {
        if (this.clickedRowsAray.length == 0) {
            this.notify.alert('Please select one row!');
        } else {
            this.nextAccordionStep();
            this.getDepartmentData();
        }
    }

    filterHOA(e: any) {
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

    getDepartmentData() {
        this.commonService.getDemandData().subscribe((resp) => {
            this.departmentList = resp;
        });
    }

    selectedDepartment(e: any): string {
        return e ? e.name : '';
    }

    saveRedistribution() {
        var payloadData: any[] = [];
        this.receiverFormArrayHelper.value.forEach((element: any) => {
            var obj = {
                fromAllotmentId: this.clickedRowsAray[0].allotmentId,
                receiverUserType: UserType.Department,
                receiverSaoDdoCode: element.deptDetails.code,
                budgetAllotedAmount: element.amount,
                mapType: EnumReleaseMapType.DEPT_to_DEPT,
                sanctionType: this.reDistributionForm.value.allotmentType,
                allotmentDate: this.clickedRowsAray[0].allotmentDate,
            };
            payloadData.push(obj);
        });
        this.commonService.submitRelease(payloadData).subscribe((resp) => {});
    }
}
