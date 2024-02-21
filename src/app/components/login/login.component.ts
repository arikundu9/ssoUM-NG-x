import { CommonService } from '@S/common.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { consoleLogService } from '@S/consoleLog.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { alertifyService, authService, localStorageService } from '@S/index';
import { environment } from '@E/environment';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
    users: any[] = [];
    token: any;

    constructor(private notify: alertifyService, private konsole: consoleLogService, private router: Router, private fb: FormBuilder, private route: ActivatedRoute, private http: HttpClient, private auth: authService) { }

    ngOnInit(): void {

    }

    login() {
        this.router.navigate(['home']);
    }
}
