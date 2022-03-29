import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class MakeModelService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  getmakemodel() {
    debugger;
    this.url = this.baseurl + 'api/INV/Make/MakeModel/MakeModel/GetMakeModel';
    return this.http.get(this.url);
  }
  addMakeModel(data) {
    debugger;
    this.url = this.baseurl + 'api/INV/Make/MakeModel/MakeModel/AddMakeModel';
    return this.http.post(this.url, data);
  }
  updateMakeModel(data) {
    this.url = this.baseurl + 'api/INV/Make/MakeModel/MakeModel/UpdateMakeModel';
    return this.http.post(this.url, data);
  }
  getMakeModelByID(ID) {
    debugger;
    this.url = this.baseurl + 'api/INV/Make/MakeModel/MakeModel/GetMakeModelByID/' + ID;
    return this.http.get(this.url);
  }
  getmodelBySeries(ModelID){
    debugger;
    this.url = this.baseurl + 'api/INV/Make/MakeModel/MakeModel/GetModelBySeries/'+ ModelID;
    return this.http.get(this.url);
  }
}
