import { CommonDialogComponent } from '@C/common/common-dialog/common-dialog.component';
import { CommonService } from '@S/common.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-jwts',
    templateUrl: './jwts.component.html',
    styleUrls: ['./jwts.component.scss']
})
export class JwtsComponent implements OnInit {
    keys: any[] = [];
    newkeyForm: FormGroup = this.fb.group({
        description: [, Validators.required],
        kid: [],
    });
    entryForm: boolean = false;
    constructor(private cS: CommonService, public dialog: MatDialog, private fb: FormBuilder) {
        this.cS.get('/Jwt').subscribe((resp: any) => {
            this.keys = resp.data;
        });
    }

    ngOnInit() {
    }

    save() {
        this.newkeyForm.markAllAsTouched();
        if (!this.newkeyForm.invalid) {
            this.cS.post(this.newkeyForm.value, '/Jwt').subscribe((resp: any) => {
                // console.log(resp);
                this.cS.get('/Jwt').subscribe((resp: any) => {
                    this.keys = resp.data;
                });
            });
        }
    }
}
