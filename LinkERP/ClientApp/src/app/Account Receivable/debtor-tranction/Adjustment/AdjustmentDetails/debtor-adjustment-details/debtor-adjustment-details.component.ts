import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { number } from 'ngx-custom-validators/src/app/number/validator';
import { ToastrService } from 'ngx-toastr';
import { PriceGroupsService } from 'src/app/inv/services/price-groups.service';
import { PurchaseOrderService } from 'src/app/pur/services/purchase-order.service';
import { AdjustmentDetail } from '../../../Model/adjustment';

@Component({
  selector: 'app-debtor-adjustment-details',
  templateUrl: './debtor-adjustment-details.component.html',
  styleUrls: ['./debtor-adjustment-details.component.css']
})
export class DebtorAdjustmentDetailsComponent implements OnInit {
@Input() AddAdjustmentDetails:any=[];
@Input() IsCloseAdjustment:any;
@Output() AddUpDateAdjustmentDetails= new EventEmitter<{AdjustmentDetails:any, Action:string}>();
AdjustmentDetails:any=[];
TaxcodeList: any[] = [];
  constructor(private toastr: ToastrService,
    private purchaseOrderService: PurchaseOrderService,
     private priceService: PriceGroupsService) { }

  ngOnInit() {
    this.BindGetTaxCode();
this.AdjustmentDetails=this.AddAdjustmentDetails
console.log(this.AddAdjustmentDetails)
  }
  AddNewAdjustmentDetailLine(){
    let AdjDetail=new AdjustmentDetail();
    this.AdjustmentDetails.push(AdjDetail);
  }
  onSave(Action){
    this.AddUpDateAdjustmentDetails.emit({AdjustmentDetails:this.AdjustmentDetails, Action:Action});
  }
  BindGetTaxCode() {
    this.priceService.getalltaxcode().subscribe((resp: any) => {
      console.log(resp);
      this.TaxcodeList = resp.data.taxcode;
      console.log(this.TaxcodeList)
    }, (error) => {
  
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  OnTaxChange(value, i) {
    this.purchaseOrderService.GetTaxTotalRateByTaxid(value).subscribe((resp: any) => {
      console.log(resp)
      if (resp.isSuccess == true) {
        let taxtotal = 0;
        if (resp.data.taxtotal) {
          taxtotal = resp.data.taxtotal;
          this.AdjustmentDetails[i].taxRate=Number(taxtotal).toFixed(Math.max(((taxtotal+ '').split(".")).length, 4));
         var tranctionAmount=Number(this.AdjustmentDetails[i].transactionAmount);
         debugger;
          var TaxAmount= (tranctionAmount - (tranctionAmount)/(1+Number(taxtotal))).toFixed(4);
          var CovtToNumber=Number(TaxAmount)
          this.AdjustmentDetails[i].taxAmount=CovtToNumber.toFixed(Math.max(((CovtToNumber+ '').split(".")).length, 4));;
          
        }
        
      }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    Deleteindex(i){
      this.AdjustmentDetails.splice(i, 1);
    }
  
    onSwitchChange(event,index){
      debugger;
      this.AdjustmentDetails;
    }
}
