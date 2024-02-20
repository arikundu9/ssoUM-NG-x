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

    constructor(private notify: alertifyService, private konsole: consoleLogService, private router: Router, private fb: FormBuilder, private route: ActivatedRoute, private http: HttpClient, private auth: authService) {}

    ngOnInit(): void {
        this.token = this.route.snapshot.queryParamMap.get('token');
        if (this.token) {
            if (environment.verifyJwt) {
                this.ssoLogin();
            } else {
                this.auth.loadJwt(this.token);
                this.router.navigate(['home']);
            }
        } else {
            this.auth.logout();
        }
    }

    ssoLogin() {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + this.token,
            }),
        };
        const url = environment.bantanUrl + 'api/' + environment.version + '/Auth/Login';
        this.http.get<{ status: any }>(url, httpOptions).subscribe(
            (responce) => {
                if ((responce.status = 'ValidToken')) {
                    if (this.auth.loadJwt(this.token)) {
                        this.router.navigate(['home']);
                        // alert(this.token);
                    } else {
                        alert('Token problem');
                    }
                    return;
                }
            },
            (error) => {
                this.notify.cloasableAlert('Invalid Token');
            }
        );
    }
}
