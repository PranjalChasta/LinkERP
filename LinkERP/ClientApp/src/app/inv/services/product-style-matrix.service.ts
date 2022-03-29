import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ProductStyleMatrixService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  getAllProductStyleMatrix() {
    this.url = this.baseurl + 'api/INV/ProductStyleMatrix/GetAllProductStyleMatrix';
    return this.http.get(this.url);
  }
  getProductStyleMatrixByID(ID) {
    this.url = this.baseurl + 'api/INV/ProductStyleMatrix/GetProductStyleMatrixByID/' + ID;
    return this.http.get(this.url);
  }
  addProductStyleMatrix(data) {
    this.url = this.baseurl + 'api/INV/ProductStyleMatrix/AddProductStyleMatrix';
    return this.http.post(this.url, data);
  }
  updateProductStyleMatrix(data) {
    this.url = this.baseurl + 'api/INV/ProductStyleMatrix/UpdateProductStyleMatrix';
    return this.http.post(this.url, data);
  }
  deleteProductStyleMatrixByID(ID, LoginID) {
    this.url = this.baseurl + 'api/INV/ProductStyleMatrix/DeleteProductStyleMatrixByID/' + ID + '/' + LoginID;
    return this.http.post(this.url, null);
  }
  checkProductStyleMatrix(id) {
    this.url = this.baseurl + 'api/INV/ProductStyleMatrix/CheckProductStyleMatrix/' + id;
    return this.http.get(this.url);
  }
  checkProductStyleMatrixDetail(styleMatrixId, detailCode) {
    this.url = this.baseurl + 'api/INV/ProductStyleMatrix/CheckProductStyleMatrixDetail/' + styleMatrixId + '/' + detailCode;
    return this.http.get(this.url);
  }
}
