import { CommonService } from '@S/common.service';
import { dataService } from '@S/data.service';
import { NotificationService } from '@S/notification.service';
import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as allEnum from '@C/common/enum';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { consoleLogService } from '@S/consoleLog.service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
    selector: 'app-budget-surrender-entry',
    templateUrl: './budget-surrender-entry.component.html',
    styleUrls: ['./budget-surrender-entry.component.scss'],
})
export class BudgetSurrenderEntryComponent implements OnInit {
    surrenderForm: FormGroup = this.fb.group({
        financialYear: ['', Validators.required],
        department: ['', Validators.required],
        fileNumber: ['', Validators.required],
        uoNumber: ['', Validators.required],
        approvingAuthority: ['', Validators.required],
        uoDate: ['', Validators.required],
        detailFormArray: this.fb.array([]),
    });
    accordionStep: number = 0;
    isSearchDone: boolean = false;
    allotSource: any;
    clickedRows = new Set<any>();
    isRowClicked: boolean = false;
    sort!: MatSort;
    paginator!: MatPaginator;
    copyAllotSource: any;
    @ViewChild(MatSort) set matSort(ms: MatSort) {
        this.sort = ms;
    }
    @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
        this.paginator = mp;
    }

    constructor(private router: Router, private commonService: CommonService, private fb: FormBuilder, private notify: NotificationService, private datePipe: DatePipe, private DataService: dataService) {}

    ngOnInit(): void {}

    searchHOA() {
        this.commonService.getSurrenderData().subscribe((v) => {
            this.allotSource = this.copyAllotSource = new MatTableDataSource(v);
            this.allotSource.paginator = this.paginator;
            this.allotSource.sort = this.sort;
        });
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

    get detailFormArray(): FormArray {
        return this.surrenderForm.controls['detailFormArray'] as FormArray;
    }

    detailFormArray_as_FormGroup(i: any): FormGroup {
        const formGroup = this.detailFormArray.controls[i] as FormGroup;
        return formGroup;
    }

    addDetailController() {
        this.detailFormArray.push(
            this.fb.group({
                amount: [''],
            })
        );
    }

    deleteDetailController(i: any) {
        this.detailFormArray.removeAt(i);
        this.tickRow(null, this.clickedRowsArray[i]);
        if (this.clickedRowsArray.length == 0) {
            this.prevAccordionStep();
        }
    }

    insert() {
        this.detailFormArray.clear();
        this.clickedRowsArray.forEach(() => {
            this.addDetailController();
        });
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
        this.insert();
    }

    get clickedRowsArray(): any[] {
        return Array.from(this.clickedRows);
    }

    get grandTotal(){
        let sum : number = 0;
        this.surrenderForm.value.detailFormArray.forEach( (elm:any) => {
            if (elm != undefined) {
                sum = sum + (elm.amount);
            }
        })
        return sum;
    }

    saveSurrender(){
        let jsonObj : any [] = [];
        let obj = {};
        for (let i = 0; i < this.clickedRowsArray.length; i++) {
            obj = {
                allotmentId : this.clickedRowsArray[i].allotmentId,
                surrenderAmount : this.surrenderForm.value.detailFormArray[i].amount
            };
            jsonObj.push(obj);
        }
        this.commonService.saveSurrender(jsonObj).subscribe(resp => {
            console.log(resp);
        });
    }
    filterHOA(e: any) {
        this.isSearchDone = true;
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
