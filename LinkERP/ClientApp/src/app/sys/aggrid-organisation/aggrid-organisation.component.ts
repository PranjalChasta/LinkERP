import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrganisationMaintenanceService } from '../services/organisation-maintenance.service';
import * as CryptoJS from 'crypto-js';
import { CryptoAes } from '../../directives/crypto-aes';
@Component({
  selector: 'app-aggrid-organisation',
  templateUrl: './aggrid-organisation.component.html',
  styleUrls: ['./aggrid-organisation.component.css']
})
export class AggridOrganisationComponent implements OnInit {
  title = 'EncryptionDecryptionSample';

  plainText: string;
  encryptText: string;
  encPassword: string;
  decPassword: string;
  conversionEncryptOutput: string;
  conversionDecryptOutput: string;
  constructor(private cryptoAes: CryptoAes) {

  }
  customColumn;
  ngOnInit() {
    this.encPassword = "Aspire@ERP_Link"
  }


  convertText(conversion: string) {
    debugger;

    if (conversion == "encrypt") {
      let Permissions = JSON.parse(localStorage.getItem('MenuPermissions'));
      let str = JSON.stringify(Permissions);
      this.conversionEncryptOutput = this.cryptoAes.EncryptString(this.plainText);
      //CryptoJS.AES.encrypt(this.plainText.trim(), this.encPassword.trim()).toString();  
      console.log(this.conversionEncryptOutput);
    }
    else {
      this.conversionDecryptOutput = this.cryptoAes.DecryptString(this.encryptText);
      //CryptoJS.AES.decrypt(this.encryptText.trim(), this.encPassword.trim()).toString(CryptoJS.enc.Utf8);  
      console.log(JSON.parse(this.conversionDecryptOutput));
      ;


    }
  }
  /* FOR Aggird End  */
}
