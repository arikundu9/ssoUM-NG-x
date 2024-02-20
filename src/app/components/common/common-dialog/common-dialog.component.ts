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
    constructor(@Inject(MAT_DIALOG_DATA) public commonDialogData: any, private cS: CommonService, private fb: FormBuilder, private dialogRef: MatDialogRef<CommonDialogComponent>, private notify: NotificationService, private toastr: ToastrService, private datePipe: DatePipe) {}

    ngOnInit(): void {
        if (this.commonDialogData.mode == 'Master Configuaration') {
            this.goNoForm = this.fb.group({
                goNo: ['', Validators.required],
                goNoDate: ['', Validators.required],
            });
            this.cS.getMasterConfiguarationData().subscribe((resp) => {
                this.goNoData = resp;
                this.goNoData.value = JSON.parse(this.goNoData?.value);
                this.goNoForm.patchValue({
                    goNo: this.goNoData?.value.fbGoNo,
                    goNoDate: this.goNoData.value.goNoDate,
                });
            });
        } else if (this.commonDialogData.mode == 'View Auto Allotment Objection') {
            this.cS.getObjectAllotmentData(this.commonDialogData.elementId).subscribe((resp) => {
                this.objectAutoAllotmentData = resp;
            });
        }
    }

    saveGoNo() {
        if (this.goNoForm.valid) {
            this.goNoForm.value.goNoDate = this.datePipe.transform(this.goNoForm.value.goNoDate, 'yyyy-MM-dd');
            this.cS.updateMasterConfigData({ keyValueJsonString: JSON.stringify({ fbGoNo: this.goNoForm.value.goNo, goNoDate: this.goNoForm.value.goNoDate }) }).subscribe((resp) => {});
            this.dialogRef.close();
        } else {
            this.toastr.error('Please fill the form carefully ..!', 'Error', {
                timeOut: 2000,
            });
            this.goNoForm.markAllAsTouched();
        }
    }

    overRuleObjection() {}
}
