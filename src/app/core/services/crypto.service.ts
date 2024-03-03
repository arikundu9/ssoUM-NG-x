import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import * as Crypto from 'crypto';
import { environment } from '@E/environment';

@Injectable({
    providedIn: 'root',
})
export class CryptoService {
    constructor() { }

    // *****The set method is use for encrypt the value*****.
    set(keys: string, value: any): any {
        const key = CryptoJS.enc.Utf8.parse(keys);
        const iv = CryptoJS.enc.Utf8.parse(keys);
        const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key, {
            keySize: 128 / 8,
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });

        return encrypted.toString();
    }

    // *****The get method is use for decrypt the value.*****
    get(keys: string, value: any): any {
        const key = CryptoJS.enc.Utf8.parse(keys);
        const iv = CryptoJS.enc.Utf8.parse(keys);
        const decrypted = CryptoJS.AES.decrypt(value, key, {
            keySize: 128 / 8,
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });

        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    encrytedData(decrytedText: string) {
        const key = CryptoJS.enc.Utf8.parse(environment.AesKey);
        const iv = CryptoJS.enc.Utf8.parse(environment.AesIV);
        const text = decrytedText.toString();
        const encryptedMessage = CryptoJS.AES.encrypt(text, key, {
            keySize: 128 / 8,
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        }).toString();
        return encryptedMessage;
    }

    decrytedData(encrytedText: string) {
        const key = CryptoJS.enc.Utf8.parse(environment.AesKey);
        const iv = CryptoJS.enc.Utf8.parse(environment.AesIV);
        const text = encrytedText.toString();
        const decryptedMessage = CryptoJS.AES.decrypt(text, key, {
            keySize: 128 / 8,
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        }).toString();
        return decryptedMessage;
    }

    // encrypt(val: string) {
    //     let cipher = Crypto.createCipheriv('aes-256-cbc', environment.AesKey, environment.AesIV);
    //     let encrypted = cipher.update(val, 'utf8', 'base64');
    //     encrypted += cipher.final('base64');
    //     return encrypted;
    // }

    // decrypt(encrypted: string) {
    //     let decipher = Crypto.createDecipheriv('aes-256-cbc', environment.AesKey, environment.AesIV);
    //     let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    //     return (decrypted + decipher.final('utf8'));
    // }
}
