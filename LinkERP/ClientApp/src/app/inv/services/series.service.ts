import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  addSeries(data) {
    debugger;
    this.url = this.baseurl + 'api/INV/Make/Series/Series/AddSeries';
    return this.http.post(this.url, data);
  }
  updateseries(data) {
    this.url = this.baseurl + 'api/INV/Make/Series/Series/UpdateSeries';
    return this.http.post(this.url, data);
  }
  getSeriesByID(ID) {
    debugger;
    this.url = this.baseurl + 'api/INV/Make/Series/Series/GetSeriesByID/' + ID;
    return this.http.get(this.url);
  }
  getSeries() {
    debugger;
    this.url = this.baseurl + 'api/INV/Make/Series/Series/GetSeries';
    return this.http.get(this.url);
  }
}

