import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }

  getBankByID(ID) {
    this.url = this.baseurl + 'api/SYS/Bank/GetBankByID/' + ID;
    return this.http.get(this.url);
  }
  addBank(data) {
    this.url = this.baseurl + 'api/SYS/Bank/AddBank';
    return this.http.post(this.url, data);
  }
  updateBank(data) {
    this.url = this.baseurl + 'api/SYS/Bank/UpdateBank';
    return this.http.post(this.url, data);
  }
  deleteBankByID(ID, DeletedBy) {
    this.url = this.baseurl + 'api/SYS/Bank/DeleteBankByID/' + ID + '/' + DeletedBy;
    return this.http.post(this.url, null);
  }

  getBank() {
    this.url = this.baseurl + 'api/SYS/Bank/GetAllBank';
    return this.http.get(this.url);
  }
  addBankAccount(data) {

    this.url = this.baseurl + 'api/SYS/BankAccount/AddBankAccount';
    return this.http.post(this.url, data);
  }

  getBankAccount() {
    this.url = this.baseurl + 'api/SYS/BankAccount/GetAllBankAccount';
    return this.http.get(this.url);
  }
  getBankAccountByBankID(BankID) {
    this.url = this.baseurl + 'api/SYS/BankAccount/GetBankAccountByBankID/' + BankID;
    return this.http.get(this.url);
  }

  getBankAccountMappingByBankID(BankCodeFrom) {
    this.url = this.baseurl + 'api/SYS/BankAccountMapping/GetBankAccountMappingByBankID/' + BankCodeFrom;
    return this.http.get(this.url);
  }

  addBankAccountMapping(data) {
    this.url = this.baseurl + 'api/SYS/BankAccountMapping/AddBankAccountMapping';
    return this.http.post(this.url, data);
  }

  deleteBankAccountMappingByID(ID, TableName, DeletedBy) {
    this.url = this.baseurl + 'api/SHARED/DeleteRecords/DeleteRecordsBYID/' + ID + '/' + TableName + '/' + DeletedBy;
    return this.http.post(this.url, null);
  }
  getBankAccountMapping() {
    this.url = this.baseurl + 'api/SYS/BankAccountMapping/GetAllBankAccountMapping';
    return this.http.get(this.url);
  }

  deleteBankAccountByID(DeletedAccountNo: any[], BankID: any, DeletedBy) {
    this.url = this.baseurl + 'api/SYS/BankAccount/DeleteBankAccountByID/' + BankID + '/' + DeletedBy;
    return this.http.post(this.url, DeletedAccountNo);
  }
  DeleteBankAccountDetails(ID, AccountNo) {
    this.url = this.baseurl + 'api/SYS/BankAccount/DeleteBankAccount/' + ID + '/' + AccountNo;
    return this.http.post(this.url, null);
  }


}
