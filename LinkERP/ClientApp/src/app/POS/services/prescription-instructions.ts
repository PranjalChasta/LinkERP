import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionInstructionsService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  addPrescriptionInstructions(data) {
    this.url = this.baseurl + 'api/SOP/PrescriptionInstructions/AddPrescriptionInstructions';
    return this.http.post(this.url, data);
  }
  updatePrescriptionInstructions(data) {
    this.url = this.baseurl + 'api/SOP/PrescriptionInstructions/UpdatePrescriptionInstructions';
    return this.http.post(this.url, data);
  }
  getPrescriptionInstructions() {
    this.url = this.baseurl + 'api/SOP/PrescriptionInstructions/GetAllPrescriptionInstructions';
    return this.http.get(this.url);
  }
  getPrescriptionInstructionsByID(ID) {
    this.url = this.baseurl + 'api/SOP/PrescriptionInstructions/GetPrescriptionInstructionsByID/' + ID;
    return this.http.get(this.url);
  }

  getInstructionTypesByID(InstructionType) {
    this.url = this.baseurl + 'api/SOP/PrescriptionInstructions/GetInstructionTypesByID/' + InstructionType;
    return this.http.get(this.url);
  }
}
