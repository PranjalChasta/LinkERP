import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryDataImportService {

  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }

  downloadTemplate(templateName) {
    this.url = this.baseurl + 'api/INV/Utilities/DownloadTemplate/' + templateName;
    return this.http.get(this.url, { responseType: 'blob' });
  }
  importCategory(data) {
    this.url = this.baseurl + 'api/INV/Utilities/ImportCategory/';
    return this.http.post(this.url, data);//, { responseType: 'blob' }
  }
  importSubCategory(data) {
    this.url = this.baseurl + 'api/INV/Utilities/ImportSubCategory/';
    return this.http.post(this.url, data);//, { responseType: 'blob' }
  }
  importInventoryMaster(data) {
    this.url = this.baseurl + 'api/INV/Utilities/ImportInventoryMaster/';
    return this.http.post(this.url, data);//, { responseType: 'blob' }
  }
  importInventoryDetails(data) {
    this.url = this.baseurl + 'api/INV/Utilities/ImportInventoryDetails/';
    return this.http.post(this.url, data);//, { responseType: 'blob' }
  }
  importInventoryBarcodes(data) {
    this.url = this.baseurl + 'api/INV/Utilities/ImportInventoryBarcodes/';
    return this.http.post(this.url, data);//, { responseType: 'blob' }
  }
}
