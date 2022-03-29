import { Injectable } from '@angular/core';
import { AppConfigService } from 'src/app/app-config.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ShiftListService {
  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }

  GetShiftList() {
    this.url = this.baseurl + 'api/POS/Shift/GetShiftList';
    return this.http.get(this.url);
  }
  GetShiftDetail(shiftID) {
    this.url = this.baseurl + 'api/POS/Shift/GetShiftDetail/' + shiftID;
    return this.http.get(this.url);
  }
  SearchShiftNumber(shiftNo) {
    this.url = this.baseurl + 'api/POS/Shift/SearchShiftNumber/' + shiftNo;
    return this.http.get(this.url);
  }
  GetReceiptDetails(companyID, shiftID) {
    this.url = this.baseurl + 'api/POS/Shift/GetReceiptDetails/' + companyID + '/' + shiftID;
    return this.http.get(this.url);
  }
  CloseShift(data) {
    this.url = this.baseurl + 'api/POS/Shift/Add_LBS_SOP_Shift';
    return this.http.post(this.url, data);
  }
  ShiftDetails(data) {
    this.url = this.baseurl + 'api/POS/Shift/AddShiftDetails';
    return this.http.post(this.url, data);
  }
}
