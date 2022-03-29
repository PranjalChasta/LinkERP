import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as config from 'src/assets/config.json'; 
@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  private readonly serviceBase =config.ServiceBase; 
  private readonly cryptoPassword = 'Aspire@ERP_Link';///DONT CHANGE PASSWORD
  private object: any;
  constructor(private http: HttpClient) {

    // this.getConfig().subscribe(data => {
    //   console.log('Config : ' + JSON.stringify(data));
    //   this.object = data;
    //   // console.log(serviceBase);
    // }, error => console.log(error));
  }
  private _configURL = 'assets/config.json';
  public getConfig(): Observable<any> {
    return this.http.get(this._configURL);
  }
  getServiceBaseUrl() {
    // let serviceBase: any = '';
    // this.getConfig().subscribe(data => {
    //   serviceBase = data.ServiceBase;
    // }, error => console.log(error));
    // alert(serviceBase);
    return this.serviceBase;
  }

  getcryptoPassword() {
    return this.cryptoPassword;
  }
}
