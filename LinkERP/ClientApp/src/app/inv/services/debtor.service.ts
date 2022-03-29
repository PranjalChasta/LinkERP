import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class DebtorService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl(); 
  }
  addDebtor(data) {
    
    this.url = this.baseurl + 'api/INV/Debtor/AddDebtor';
    return this.http.post(this.url, data);
  }
  updatedebtor(data) {
    this.url = this.baseurl + 'api/INV/Debtor/UpdateDebtor';
    return this.http.post(this.url, data);
  }
 

  getDebtor()
  {
    
    this.url = this.baseurl + 'api/INV/Debtor/GetDebtor';
    return this.http.get(this.url);
  }
  getDebtorByID(ID) {
    
    this.url = this.baseurl + 'api/INV/Debtor/GetDebtorByID/' + ID;
    return this.http.get(this.url);
  }
  CheckUnpaidTranction(DebtorID) {
    
    this.url = this.baseurl + 'api/INV/Debtor/CheckUnpaidTranction/' + DebtorID;
    return this.http.get(this.url);
  }
  getPriceWorkflows() {
    this.url = this.baseurl + 'api/POS/Common/GetPriceWorkflows';
    return this.http.get(this.url);
  }
  getDebtorTranctionByID(ID) {
    
    this.url = this.baseurl + 'api/INV/Debtor/GetDebtorTranctionByID/' + ID;
    return this.http.get(this.url);
  }
  GetDebtorDebitTranctionByID(ID) {
    
    this.url = this.baseurl + 'api/INV/Debtor/GetDebtorDebitTranctionByID/' + ID;
    return this.http.get(this.url);
  }
  GetDebtorCreditTranctionByID(ID) {
    
    this.url = this.baseurl + 'api/INV/Debtor/GetDebtorCreditTranctionByID/' + ID;
    return this.http.get(this.url);
  }

  debtorTransactionAllocations(data) {
    
    this.url = this.baseurl + 'api/INV/Debtor/DebtorTransactionAllocations';
    return this.http.post(this.url, data);
  }
}
