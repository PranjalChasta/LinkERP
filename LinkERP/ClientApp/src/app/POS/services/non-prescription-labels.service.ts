import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class NonPrescriptionLabelsService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  addNonPrescriptionLabels(data) {
    this.url = this.baseurl + 'api/SOP/NonPrescriptionLabels/AddNonPrescriptionLabels';
    return this.http.post(this.url, data);
  }
  updateNonPrescriptionLabels(data) {
    this.url = this.baseurl + 'api/SOP/NonPrescriptionLabels/UpdateNonPrescriptionLabels';
    return this.http.post(this.url, data);
  }
  getNonPrescriptionLabelsPrice(ProductID) {
    this.url = this.baseurl + 'api/SOP/NonPrescriptionLabels/GetNonPrescriptionLabelsPrice/' + ProductID ;
    return this.http.get(this.url);
  }
}
