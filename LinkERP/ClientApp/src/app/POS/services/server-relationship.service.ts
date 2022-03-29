import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ServerRelationshipService {

  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  addServerRelationShip(data) {
    this.url = this.baseurl + 'api/POS/ServerRelationShip/AddServerRelationShip';
    return this.http.post(this.url, data);
  }
  updateServerRelationShip(data) {
    this.url = this.baseurl + 'api/POS/ServerRelationShip/UpdateServerRelationShip';
    return this.http.post(this.url, data);
  }
  getServerRelationShips() {
    this.url = this.baseurl + 'api/POS/ServerRelationShip/GetAllServerRelationships';
    return this.http.get(this.url);
  }
  getServerRelationShipByID(ID) {
    this.url = this.baseurl + 'api/POS/ServerRelationShip/GetServerRelationshipsByID/' + ID;
    return this.http.get(this.url);
  }
  getServers() {
    this.url = this.baseurl + 'api/POS/Common/GetServers';
    return this.http.get(this.url);
  }
}
