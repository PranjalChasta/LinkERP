import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class TransferService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }

  GetTransferDetails(ID) {
    this.url = this.baseurl + 'api/INV/Transfer/GetTransferDetails/' + ID;
    return this.http.get(this.url);
  }
}
