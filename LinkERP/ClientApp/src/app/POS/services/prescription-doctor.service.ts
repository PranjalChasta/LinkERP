import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionDoctorService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  addPrescriptionDector(data) {
    this.url = this.baseurl + 'api/SOP/PrescriptionDoctor/AddPrescriptionDoctor';
    return this.http.post(this.url, data);
  }
  updatePrescriptionDector(data) {
    this.url = this.baseurl + 'api/SOP/PrescriptionDoctor/UpdatePrescriptionDoctor';
    return this.http.post(this.url, data);
  }
  getDoctorPrescription() {
    this.url = this.baseurl + 'api/SOP/PrescriptionDoctor/GetAllDoctorPrescriptions';
    return this.http.get(this.url);
  }
  getDoctorPrescriptionByID(ID) {
    this.url = this.baseurl + 'api/SOP/PrescriptionDoctor/GetDoctorPrescriptionsByID/' + ID;
    return this.http.get(this.url);
  }
 
}
