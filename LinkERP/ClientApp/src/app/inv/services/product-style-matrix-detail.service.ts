import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ProductStyleMatrixDetailService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  getMatrixDetailByID(ID) {
    this.url = this.baseurl + 'api/INV/ProductStyleMatrixDetail/GetMatrixDetailByID/' + ID;
    return this.http.get(this.url);
  }
  addMatrixDetail(data) {
    this.url = this.baseurl + 'api/INV/ProductStyleMatrixDetail/AddMatrixDetail';
    return this.http.post(this.url, data);
  }
  updateMatrixDetail(data) {
    this.url = this.baseurl + 'api/INV/ProductStyleMatrixDetail/UpdateMatrixDetail';
    return this.http.post(this.url, data);
  }
  deleteMatrixDetailByID(DeletedPMDs: any[], DeletedBy) {
    this.url = this.baseurl + 'api/INV/ProductStyleMatrixDetail/DeleteMatrxiDetailByID/' + DeletedBy;
    return this.http.post(this.url, DeletedPMDs);
  }

  getMatrixDetail() {
    this.url = this.baseurl + 'api/INV/ProductStyleMatrixDetail/GetMatrixDetails';
    return this.http.get(this.url);
  }

  //
  updateproductmatrixdetailList(data){
    debugger;
    this.url = this.baseurl + 'api/INV/ProductStyleMatrixDetail/ProductMatrixDetailList';
    return this.http.post(this.url, data);
  }

  getMatrixExistsInProductMatrixAccess(StyleMatrixID) {
    this.url = this.baseurl + 'api/INV/ProductStyleMatrixDetail/GetMatrixDetailByStyleMatrixID/' + StyleMatrixID;
    return this.http.get(this.url);
  }
}
