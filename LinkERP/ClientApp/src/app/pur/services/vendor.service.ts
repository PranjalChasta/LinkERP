import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  getVendors() {
    debugger;
    this.url = this.baseurl + 'api/PUR/ACPVendor/GetAllVendor';
    return this.http.get(this.url);
  }
  addVendors(data) {
    debugger;
    this.url = this.baseurl + 'api/PUR/ACPVendor/AddVendor';
    return this.http.post(this.url, data);
  }
  updatevendors(data) {
    this.url = this.baseurl + 'api/PUR/ACPVendor/UpdateVendor';
    return this.http.post(this.url, data);
  }
  getVendorbyID(ID) {
    debugger;
    this.url = this.baseurl + 'api/PUR/ACPVendor/GetVendorByID/' + ID;
    return this.http.get(this.url);
  }
}
