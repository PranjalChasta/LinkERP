import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }

  GetTransactionHistoryDetails(ID) {
    this.url = this.baseurl + 'api/INV/TransactionHistory/GetTransactionHistoryDetails/' + ID;
    return this.http.get(this.url);
  }
}
