import { CommonService } from '@S/common.service';
import { NotificationService } from '@S/notification.service';
import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-common-dialog',
    templateUrl: './common-dialog.component.html',
    styleUrls: ['./common-dialog.component.scss'],
})
export class CommonDialogComponent implements OnInit {
    goNoData: any;
    goNoForm!: FormGroup;
    newkeyForm: FormGroup = this.fb.group({
        type: [, Validators.required],
        publicKey: [],
        privateKey: [, Validators.required],
        algo: [, Validators.required],
    });
    objectAutoAllotmentData: any;
    constructor(@Inject(MAT_DIALOG_DATA) public commonDialogData: any, /*@Inject(MAT_DIALOG_DEFAULT_OPTIONS) public defaultConfig: any,*/ private cS: CommonService, private fb: FormBuilder, private dialogRef: MatDialogRef<CommonDialogComponent>, private notify: NotificationService, private toastr: ToastrService, private datePipe: DatePipe) { }

    maximize() {
        this.dialogRef.updateSize('100vw', '100vh');
    }

    ngOnInit(): void {
        console.log(this.commonDialogData);
        console.log(this.dialogRef);

        switch (this.commonDialogData.mode) {
            case 'Master Configuaration':
                this.goNoForm = this.fb.group({
                    goNo: ['', Validators.required],
                    goNoDate: ['', Validators.required],
                });
                break;

            default:
                break;
        }
    }

    saveKey(){
        this.cS.post(this.newkeyForm.value, '/Key').subscribe((resp: any) => {
            // console.log(resp);
        });
    }

    overRuleObjection() {

    }
}
