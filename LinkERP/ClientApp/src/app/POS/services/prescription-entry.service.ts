import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionEntryService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  addMedication(data) {
    this.url = this.baseurl + 'api/PrescriptionMaintenance/AddMedication/';
    return this.http.post(this.url, data);
  }
  addPrescription(data) {
    this.url = this.baseurl + 'api/PrescriptionMaintenance/AddPrescription/';
    return this.http.post(this.url, data);
  }
  updatePrescription(data) {
    this.url = this.baseurl + 'api/PrescriptionMaintenance/UpdatePrescription';
    return this.http.post(this.url, data);
  }
  getAllPrescription() {
    this.url = this.baseurl + 'api/PrescriptionMaintenance/GetAllPrescription';
    return this.http.get(this.url);
  }
  getPrescriptionByID(ID) {
    this.url = this.baseurl + 'api/PrescriptionMaintenance/GetPrescriptionByID/' + ID;
    return this.http.get(this.url);
  }
  getDebtorForPrescription() {
    this.url = this.baseurl + 'api/PrescriptionMaintenance/GetDebtorForPrescription';
    return this.http.get(this.url);
  }
  copyPrescriptionByID(ID) {
    this.url = this.baseurl + 'api/PrescriptionMaintenance/CopyPrescriptionByID/'+ ID;
    return this.http.get(this.url);
  }
  copyPrescriptionsByIDs(selectedIDs): Observable<any> {
    this.url = this.baseurl + 'api/PrescriptionMaintenance/CopyPrescriptionsByIDs/?selectedIDs='+ selectedIDs;
    return this.http.get(this.url);
  }
  viewCopiesById(ID){
    this.url = this.baseurl + 'api/PrescriptionMaintenance/ViewCopiesById/'+ ID;
    return this.http.get(this.url);
  }
  PrescriptionNumberCount(prescriptionNo){
    this.url = this.baseurl + 'api/PrescriptionMaintenance/PrescriptionNumberCount/'+ prescriptionNo;
    return this.http.get(this.url);
  }
  GetPrescriptions(prescriptionNo){
    this.url = this.baseurl + 'api/PrescriptionMaintenance/GetPrescriptions/'+ prescriptionNo;
    return this.http.get(this.url);
  }
  AddMixture(data){
    this.url = this.baseurl + 'api/PrescriptionMaintenance/AddMixture';
    return this.http.post(this.url, data);
  }
  GetMixtureDetailsByID(prescriptionId){
    this.url = this.baseurl + 'api/PrescriptionMaintenance/GetMixtureDetailsByID/'+ prescriptionId;
    return this.http.get(this.url);
  }
}
