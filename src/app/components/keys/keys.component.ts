import { CommonDialogComponent } from '@C/common/common-dialog/common-dialog.component';
import { CommonService } from '@S/common.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-keys',
    templateUrl: './keys.component.html',
    styleUrls: ['./keys.component.scss']
})
export class KeysComponent implements OnInit {
    keys: any[] = [];

    constructor(private cS: CommonService, public dialog: MatDialog) {
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

}
