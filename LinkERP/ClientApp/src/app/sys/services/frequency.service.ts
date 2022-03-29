import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class FrequencyService {

  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }

  getFrequencies() {
    this.url = this.baseurl + 'api/SYS/Frequency/GetFrequency';
    return this.http.get(this.url);
  }
  getFrequencyByID(ID) {
    this.url = this.baseurl + 'api/SYS/Frequency/GetFrequencyByID/' + ID;
    return this.http.get(this.url);
  }
  addFrequency(data) {
    
    this.url = this.baseurl + 'api/SYS/Frequency/AddFrequency';
    return this.http.post(this.url, data);
  }

  updateFrequency(data) {
    this.url = this.baseurl + 'api/SYS/Frequency/UpdateFrequency';
    return this.http.post(this.url, data);
  }

  deleteFrequencyByID(ID, LoginID) {
    
    this.url = this.baseurl + 'api/SYS/Frequency/DeleteFrequencyByID/' + ID + '/' + LoginID;
    return this.http.post(this.url, null);
  }


}
