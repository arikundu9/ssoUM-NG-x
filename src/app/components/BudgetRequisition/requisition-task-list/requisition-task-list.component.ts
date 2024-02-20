import { RequisitionStatus } from '@C/common/enum';
import { CommonService } from '@S/common.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-requisition-task-list',
    templateUrl: './requisition-task-list.component.html',
    styleUrls: ['./requisition-task-list.component.scss'],
})
export class RequisitionTaskListComponent implements OnInit {
    private paginator!: MatPaginator;
    private sort!: MatSort;
    filterForm!: FormGroup;

    allotSource: any;
    clickedRows = new Set<any>();
    isRowClicked: boolean = false;
    displayedColumns: string[] = ['id', 'initialRequestBySaoDdoCode', 'requestBySaoDdoCode', 'requestTo', 'hoa', 'amount', 'requestremark', 'requisitiondate', 'status'];
    copyAllotSource: any;

    @ViewChild(MatSort) set matSort(ms: MatSort) {
        this.sort = ms;
    }
    @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
        this.paginator = mp;
    }

    constructor(private cs: CommonService, private fb: FormBuilder) {}

    ngOnInit(): void {
        this.cs.getRequisitionDataByMe().subscribe((resp) => {
            this.allotSource = this.copyAllotSource = new MatTableDataSource(resp);
            this.allotSource.paginator = this.paginator;
            this.allotSource.sort = this.sort;
        });
        this.filterForm = this.fb.group({
            filterString: [''],
        });
    }

    get getStatusValue() {
        return RequisitionStatus;
    }

    applyFilter() {
        this.allotSource.filter = this.filterForm.value.filterString!.trim().toLowerCase();
    }
}
