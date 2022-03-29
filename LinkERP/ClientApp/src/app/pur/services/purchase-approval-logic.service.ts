import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseApprovalLogicService {
  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
   }
    getPurchaseApprovalLogic(PurchaseOrderID) {
    debugger;
    this.url = this.baseurl + 'api/PUR/PurchaseApprovalLogs/PurchaseApprovalLogs/GetAllPurchaseApprovalLogs/'+ PurchaseOrderID;
    return this.http.get(this.url);
  }
}
