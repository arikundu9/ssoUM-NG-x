import { CommonService } from '@S/common.service';
import { NotificationService } from '@S/notification.service';
import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-common-dialog',
    templateUrl: './common-dialog.component.html',
    styleUrls: ['./common-dialog.component.scss'],
})
export class CommonDialogComponent implements OnInit {
    goNoData: any;
    goNoForm!: FormGroup;
    objectAutoAllotmentData: any;
    constructor(@Inject(MAT_DIALOG_DATA) public commonDialogData: any, private cS: CommonService, private fb: FormBuilder, private dialogRef: MatDialogRef<CommonDialogComponent>, private notify: NotificationService, private toastr: ToastrService, private datePipe: DatePipe) { }

    ngOnInit(): void {
        if (this.commonDialogData.mode == 'Master Configuaration') {
            this.goNoForm = this.fb.group({
                goNo: ['', Validators.required],
                goNoDate: ['', Validators.required],
            });
        } else if (this.commonDialogData.mode == 'View Auto Allotment Objection') {

        }
    }

    overRuleObjection() { }
}
