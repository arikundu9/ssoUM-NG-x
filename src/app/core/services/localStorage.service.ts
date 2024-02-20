import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, Observable, Subject } from 'rxjs';
import { environment } from '@E/environment';
import { catchError, map, filter } from 'rxjs/operators';
import { CryptoService } from './crypto.service';

@Injectable({
    providedIn: 'root',
})
export class localStorageService {
    static crypto: any = new CryptoService();
    constructor(private crypto: CryptoService) {}
    // set(key:string,value:any){
    //     localStorage.setItem(key,this.crypto.set(environment.AesKey,value));
    // }
    // get(key:string):any{
    //     return localStorage.getItem(key) ==null ? null : this.crypto.get(environment.AesKey,localStorage.getItem(key));
    // }
    del(key: string) {
        localStorage.removeItem(key);
    }
    static set(key: string, value: any) {
        key = this.crypto.set(environment.AesKey, key);
        localStorage.setItem(key, this.crypto.set(environment.AesKey, value));
    }
    static get(key: string): any {
        key = this.crypto.set(environment.AesKey, key);
        return localStorage.getItem(key) == null ? null : this.crypto.get(environment.AesKey, localStorage.getItem(key));
    }
    static del(key: string) {
        key = this.crypto.set(environment.AesKey, key);
        localStorage.removeItem(key);
    }
}
