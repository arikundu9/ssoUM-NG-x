import { CommonDialogComponent } from '@C/common/common-dialog/common-dialog.component';
import { CommonService } from '@S/common.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-keys',
    templateUrl: './keys.component.html',
    styleUrls: ['./keys.component.scss']
})
export class KeysComponent implements OnInit {
    keys: any[] = [];
    newkeyForm: FormGroup = this.fb.group({
        type: [, Validators.required],
        publicKey: [],
        privateKey: [, Validators.required],
        algo: [, Validators.required],
    });
    entryForm: boolean = false;

    constructor(private cS: CommonService, public dialog: MatDialog, private fb: FormBuilder) {
        this.cS.get('/Key').subscribe((resp: any) => {
            this.keys = resp.data;
        });
    }

    ngOnInit() {

    }

    add() {
        this.dialog.open(CommonDialogComponent, {
            minWidth: '50vw',
            maxWidth: '100%',
            // enterAnimationDuration: '10ms',
            // exitAnimationDuration: '200ms',
            data: {
                mode: 'Add New Key',
            },
        });
    }

    saveKey() {
        this.newkeyForm.markAllAsTouched();
        if (!this.newkeyForm.invalid) {
            this.cS.post(this.newkeyForm.value, '/Key').subscribe((resp: any) => {
                // console.log(resp);
                this.cS.get('/Key').subscribe((resp: any) => {
                    this.keys = resp.data;
                });
            });
        }
    }

}
