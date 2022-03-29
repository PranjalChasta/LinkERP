import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class PatientMaintenanceService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  addPatient(data) {
    this.url = this.baseurl + 'api/SOP/PatientMaintenance/AddPatient';
    return this.http.post(this.url, data);
  }
  updatePatient(data) {
    this.url = this.baseurl + 'api/SOP/PatientMaintenance/UpdatePatient';
    return this.http.post(this.url, data);
  }
  getPatient() {
    this.url = this.baseurl + 'api/SOP/PatientMaintenance/GetAllPatient';
    return this.http.get(this.url);
  }
  getPatientByID(ID) {
    this.url = this.baseurl + 'api/SOP/PatientMaintenance/GetPatientByID/' + ID;
    return this.http.get(this.url);
  }

}
