import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class CreditReasonsService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  GetCreditReasonsByCompanyID(companyID) {
    this.url = this.baseurl + 'api/POS/CreditReasons/GetCreditReasonsByCompanyID/' + companyID;
    return this.http.get(this.url);
  }
  SaveCreditReasons(data) {
    this.url = this.baseurl + 'api/POS/CreditReasons/SaveCreditReasons';
    return this.http.post(this.url, data);
  }
  DeleteCreditReason(ID, ActionName, isDeleted) {
    debugger;
    this.url = this.baseurl + 'api/POS/CreditReasons/DeleteCreditReason/' + ID + '/' + ActionName + '/' +isDeleted;
    return this.http.post(this.url, null);
  }
  FetchCreditReasons(companyID, ID, isdeleted) {
    this.url = this.baseurl + 'api/POS/CreditReasons/FetchCreditReasons?companyID=' + companyID + '&ID=' +ID + '&isDeleted=' +isdeleted;
    return this.http.get(this.url);
  }
}
