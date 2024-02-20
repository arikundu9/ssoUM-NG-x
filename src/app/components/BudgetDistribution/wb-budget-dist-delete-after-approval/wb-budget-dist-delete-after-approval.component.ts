import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CommonService } from '@S/common.service';
import { NotificationService } from '@S/notification.service';

@Component({
    selector: 'app-wb-budget-dist-delete-after-approval',
    templateUrl: './wb-budget-dist-delete-after-approval.component.html',
    styleUrls: ['./wb-budget-dist-delete-after-approval.component.css'],
})
export class WbBudgetDistDeleteAfterApprovalComponent implements OnInit {
    accordionStep = 0;
    clickedRowsArray : any[] = [];
    payloadDataForDelete : any[] = [];
    allotmentTypeForm !: FormGroup;

    allotSource: any;
    clickedRows = new Set<any>();
    isRowClicked: boolean = false;
    displayedColumns: string[] = ['allotmentId','allotmentdate','saoDdoDept','hoa','allotedAmount', 'selection'];

    private paginator!: MatPaginator;
    private sort!: MatSort;

    copyAllotSource : any;

    @ViewChild(MatSort) set matSort(ms: MatSort) {
        this.sort = ms;
    }
    @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
        this.paginator = mp;
    }

    constructor(private commonService: CommonService, private notify: NotificationService, private router : Router, private fb : FormBuilder) {}

    ngOnInit(): void {
        this.allotmentTypeForm = this.fb.group({
            allotmentType : ['',Validators.required]
        });
        this.getAllotment();
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
        this.commonService.getApprovedAllotments().subscribe((resp) => {
            // console.log(resp);
            this.allotSource = this.copyAllotSource = new MatTableDataSource(resp);
            this.allotSource.paginator = this.paginator;
            this.allotSource.sort = this.sort;
        });
    }

    goForDelete(){
        this.clickedRowsArray = Array.from(this.clickedRows);
        if(this.clickedRowsArray.length > 0){
            this.deleteAfterApproval();
        }else{
            this.notify.alert("Please select atleast one row..!");
        }
    }

    deleteAfterApproval() {
        this.notify.confirmProposal('Are you sure ?', 'Do you really want to revert the grants?').then((res) => {
            if (res) {
                this.clickedRowsArray = Array.from(this.clickedRows);
                this.clickedRowsArray.forEach( elem => {
                    this.payloadDataForDelete.push(elem.allotmentId);
                })
                this.commonService.revertAllotments(this.payloadDataForDelete).subscribe((resp) => {
                    // this.notify.success("Allotments deleted successfully..!");
                    // this.router.navigate(['home']);
                });
            }
        });
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
}
