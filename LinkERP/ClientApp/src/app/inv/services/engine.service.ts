import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class EngineService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  addEngine(data) {
    debugger;
    this.url = this.baseurl + 'api/INV/Make/Engine/Engine/AddEngine';
    return this.http.post(this.url, data);
  }
  updateEngine(data) {
    this.url = this.baseurl + 'api/INV/Make/Engine/Engine/UpdateEngine';
    return this.http.post(this.url, data);
  }
  getEngineByID(ID) {
    debugger;
    this.url = this.baseurl + 'api/INV/Make/Engine/Engine/GetEngineByID/' + ID;
    return this.http.get(this.url);
  }

  getAllEngines(MakeID, ModelID)
  {
    this.url = this.baseurl + 'api/INV/Make/Engine/Engine/GetAllEngines/'+ MakeID + '/' + ModelID;
    return this.http.get(this.url);
  }
  getSeriesIDDetails(SeriesID)
  {
    debugger;
    this.url = this.baseurl + 'api/INV/Make/Engine/Engine/GetEngineBySeriesID/'+ SeriesID;
    return this.http.get(this.url);
  }

}
