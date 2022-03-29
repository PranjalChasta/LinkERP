import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';
import { AppConfigService } from '../app-config.service';
@Injectable({
    providedIn: 'root'
})
export class CryptoAes {

    encPassword: string;
    constructor(private appCongfigService: AppConfigService) {
        this.encPassword = appCongfigService.getcryptoPassword();
    //this.encPassword = "Aspire@ERP_Link"///---DON'T CHANGE THIS PASSWORD}

    }

    EncryptString(plainText) {
        return CryptoJS.AES.encrypt(plainText.trim(), this.encPassword.trim()).toString();

    }

    DecryptString(plainText) {
        return CryptoJS.AES.decrypt(plainText.trim(), this.encPassword.trim()).toString(CryptoJS.enc.Utf8);
    }
}