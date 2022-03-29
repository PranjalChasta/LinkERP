import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class GiftVoucherService {
  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
   }

  GetGiftVoucherList() {
    this.url = this.baseurl + 'api/POS/GiftVoucher/GetGiftVoucherList';
    return this.http.get(this.url);
  }
}
