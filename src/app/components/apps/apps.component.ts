import { CommonService } from '@S/index';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-apps',
    templateUrl: './apps.component.html',
    styleUrls: ['./apps.component.scss']
})
export class AppsComponent implements OnInit {

    AppRegistrationForm: FormGroup = this.fb.group({
        'redirecturl': ['', Validators.required],
        'jid': [0, Validators.required],
        'appName': ['', Validators.required]
    });

    constructor(private cS: CommonService, private fb: FormBuilder) { }

    ngOnInit() {
        this.cS.get('/App').subscribe((resp: any) => {
            console.log(resp);
        });
    }

    registerApp() {
        this.cS.post(this.AppRegistrationForm.value, '/App').subscribe((resp: any) => {
            console.log(resp);
        });
    }
}
